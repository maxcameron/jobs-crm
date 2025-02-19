
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

  // Handle navigation after confirming auth state and preferences
  useEffect(() => {
    if (!session || isLoading || preferencesLoading) {
      console.log("[AuthProvider] Still loading:", {
        hasSession: !!session,
        isLoading,
        preferencesLoading
      });
      return;
    }

    console.log("[AuthProvider] Checking navigation state:", {
      path: location.pathname,
      hasCompletedOnboarding: preferences?.has_completed_onboarding,
      isAuthPath: location.pathname === '/auth'
    });

    // If we're on the auth page and we have a session, redirect based on onboarding status
    if (location.pathname === '/auth' && session) {
      if (preferences?.has_completed_onboarding) {
        console.log("[AuthProvider] Redirecting to home - onboarding completed");
        navigate('/', { replace: true });
      } else {
        console.log("[AuthProvider] Redirecting to onboarding - not completed");
        navigate('/onboarding', { replace: true });
      }
      return;
    }

    // If we have no session and we're not on the auth page, redirect to auth
    if (!session && location.pathname !== '/auth') {
      console.log("[AuthProvider] No session, redirecting to auth");
      navigate('/auth');
      return;
    }

    // If onboarding is not completed and we're not on the onboarding page, redirect to onboarding
    if (session && !preferences?.has_completed_onboarding && location.pathname !== '/onboarding') {
      console.log("[AuthProvider] Redirecting to onboarding - not completed yet");
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
