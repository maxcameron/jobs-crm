
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  supabase: typeof supabase;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  supabase,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: preferences } = useQuery({
    queryKey: ['preferences', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data, error } = await supabase
        .from('user_tracking_preferences')
        .select('has_completed_onboarding')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        if (error.code === '403') {
          console.error("User authentication error:", error);
          await handleSignOut();
          return null;
        }
        throw error;
      }
      return data;
    },
    enabled: !!session?.user.id,
  });

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
      setSession(null);
      navigate('/auth');
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email || "No session");
      setSession(session);
      if (!session) {
        navigate('/auth');
      } else if (session && preferences === null && location.pathname !== '/onboarding') {
        navigate('/onboarding');
      } else if (session && preferences?.has_completed_onboarding && location.pathname === '/auth') {
        navigate('/');
      }
      setIsLoading(false);
    }).catch(error => {
      console.error("Error getting initial session:", error);
      setIsLoading(false);
      navigate('/auth');
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      setSession(session);
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      // Only redirect if we're on auth page or need onboarding
      if (location.pathname === '/auth') {
        if (preferences === null) {
          navigate('/onboarding');
        } else if (preferences?.has_completed_onboarding) {
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, preferences, location.pathname]);

  return (
    <AuthContext.Provider value={{ session, isLoading, supabase }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
