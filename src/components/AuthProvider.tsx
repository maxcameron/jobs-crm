
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  supabase: typeof supabase;
  handleSignOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  supabase,
  handleSignOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['preferences', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      console.log("Fetching preferences for user:", session.user.id);
      const { data, error } = await supabase
        .from('user_tracking_preferences')
        .select('*')  // Select all fields to ensure we have complete data
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Preferences fetch error:", error);
        return null;
      }
      console.log("Fetched preferences:", data);
      return data;
    },
    enabled: !!session?.user.id,
    staleTime: 1000, // Add a small stale time to prevent immediate refetches
    refetchOnMount: true, // Ensure we always have fresh data when mounting
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      }
      setSession(null);
      navigate('/auth');
    } catch (error) {
      console.error("Error in handleSignOut:", error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession?.user?.email || "No session");
      if (initialSession?.user) {
        setSession(initialSession);
      } else if (location.pathname !== '/auth') {
        navigate('/auth');
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log("Auth state changed:", _event, currentSession?.user?.email);
      setSession(currentSession);
      
      if (!currentSession && location.pathname !== '/auth') {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // Handle onboarding redirects after confirming auth state and preferences are loaded
  useEffect(() => {
    if (!session || isLoading || preferencesLoading) return;
    
    console.log("Checking onboarding status:", {
      path: location.pathname,
      preferences,
      hasCompletedOnboarding: preferences?.has_completed_onboarding,
      isLoading,
      preferencesLoading
    });

    // Don't redirect if we're already on the auth or onboarding pages
    if (location.pathname === '/auth' || location.pathname === '/onboarding') return;

    // Explicitly check for false value of has_completed_onboarding
    if (preferences?.has_completed_onboarding === false) {
      console.log("Redirecting to onboarding - not completed");
      navigate('/onboarding', { replace: true });
    }
  }, [session, preferences, isLoading, preferencesLoading, location.pathname, navigate]);

  const value = {
    session,
    isLoading: isLoading || preferencesLoading,
    supabase,
    handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && !preferencesLoading && children}
    </AuthContext.Provider>
  );
};
