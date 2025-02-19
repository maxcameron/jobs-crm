
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

  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['preferences', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) {
        console.log("[AuthProvider] No user ID available for preferences fetch");
        return null;
      }
      
      console.log("[AuthProvider] Fetching preferences for user:", session.user.id);
      console.log("[AuthProvider] Current cache state:", 
        queryClient.getQueryData(['preferences', session.user.id])
      );

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
    refetchOnMount: true,
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("[AuthProvider] Initial session check:", initialSession?.user?.email || "No session");
      setSession(initialSession);
      setIsLoading(false);

      // Handle initial navigation based on session state
      if (initialSession?.user) {
        console.log("[AuthProvider] Session found, checking location:", location.pathname);
        if (location.pathname === '/auth') {
          navigate('/onboarding', { replace: true });
        }
      } else if (location.pathname !== '/auth') {
        navigate('/auth');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log("[AuthProvider] Auth state changed:", _event, currentSession?.user?.email);
      setSession(currentSession);
      
      // Handle navigation on auth state change
      if (currentSession) {
        console.log("[AuthProvider] New session detected, checking location:", location.pathname);
        if (location.pathname === '/auth') {
          navigate('/onboarding', { replace: true });
        }
      } else if (location.pathname !== '/auth') {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // Handle onboarding redirects after confirming auth state and preferences are loaded
  useEffect(() => {
    if (!session || isLoading || preferencesLoading) {
      console.log("[AuthProvider] Still loading:", {
        hasSession: !!session,
        isLoading,
        preferencesLoading
      });
      return;
    }
    
    console.log("[AuthProvider] Checking onboarding status:", {
      path: location.pathname,
      preferences,
      hasCompletedOnboarding: preferences?.has_completed_onboarding,
      rawPreferences: preferences,
      isLoading,
      preferencesLoading,
      queryKey: ['preferences', session.user.id],
      cachedData: queryClient.getQueryData(['preferences', session.user.id])
    });

    // Don't redirect if we're already on the auth or onboarding pages
    if (location.pathname === '/auth' || location.pathname === '/onboarding') {
      console.log("[AuthProvider] On auth/onboarding page, skipping redirect");
      return;
    }

    // Explicitly check for false value of has_completed_onboarding
    if (preferences?.has_completed_onboarding === false) {
      console.log("[AuthProvider] Redirecting to onboarding - not completed");
      navigate('/onboarding', { replace: true });
    } else {
      console.log("[AuthProvider] No redirect needed:", {
        hasCompletedOnboarding: preferences?.has_completed_onboarding,
        preferences
      });
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
