
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  // Query for user preferences
  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['preferences', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) {
        console.log("[AuthProvider] No user ID available for preferences fetch");
        return null;
      }
      
      console.log("[AuthProvider] Fetching preferences for user:", session.user.id);
      
      const { data, error } = await supabase
        .from('user_tracking_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error("[AuthProvider] Preferences fetch error:", error);
        return null;
      }

      console.log("[AuthProvider] Raw preferences data from DB:", data);
      return data;
    },
    enabled: !!session?.user.id,
    staleTime: 1000,
    retry: 2,
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[AuthProvider] Error signing out:", error);
      }
      setSession(null);
      queryClient.clear(); // Clear the query cache on signout
      navigate('/auth');
    } catch (error) {
      console.error("[AuthProvider] Error in handleSignOut:", error);
    }
  };

  // Initial session check and auth state change subscription
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("[AuthProvider] Initial session check:", initialSession?.user?.email || "No session");
      setSession(initialSession);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log("[AuthProvider] Auth state changed:", _event, currentSession?.user?.email);
      setSession(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Navigation logic
  useEffect(() => {
    // Don't make any navigation decisions until we have both session and preferences loaded
    const isInitializing = isLoading || (session && preferencesLoading);
    if (isInitializing) {
      console.log("[AuthProvider] Still initializing:", {
        isLoading,
        hasSession: !!session,
        preferencesLoading
      });
      return;
    }

    console.log("[AuthProvider] Ready to handle navigation:", {
      path: location.pathname,
      hasSession: !!session,
      preferences,
      isAuthPath: location.pathname === '/auth'
    });

    // No session means redirect to auth (unless already there)
    if (!session) {
      if (location.pathname !== '/auth') {
        console.log("[AuthProvider] No session, redirecting to auth");
        navigate('/auth');
      }
      return;
    }

    // If we reach here, we have a session and preferences are loaded
    const hasCompletedOnboarding = preferences?.has_completed_onboarding;

    // Only redirect to onboarding if we explicitly have has_completed_onboarding = false
    if (hasCompletedOnboarding === false) {
      if (location.pathname !== '/onboarding') {
        console.log("[AuthProvider] Redirecting to onboarding - not completed");
        navigate('/onboarding', { replace: true });
      }
      return;
    }

    // User has completed onboarding or we're not sure yet (loading)
    if (hasCompletedOnboarding === true && (location.pathname === '/auth' || location.pathname === '/onboarding')) {
      console.log("[AuthProvider] Redirecting to home - onboarding completed");
      navigate('/', { replace: true });
    }

  }, [session, isLoading, preferencesLoading, preferences, location.pathname, navigate]);

  const value = {
    session,
    isLoading: isLoading || preferencesLoading,
    supabase,
    handleSignOut,
  };

  // Only render children when we're not loading
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && !preferencesLoading && children}
    </AuthContext.Provider>
  );
};
