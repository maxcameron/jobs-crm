
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { TrackingPreferences } from "@/components/TrackingPreferences";
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_tracking_preferences')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const completeOnboarding = async () => {
    try {
      const { error } = await supabase
        .from('user_tracking_preferences')
        .update({ has_completed_onboarding: true })
        .eq('user_id', session?.user.id);

      if (error) throw error;

      toast({
        title: "Welcome aboard! 🎉",
        description: "Your preferences have been saved. Let's get started!",
      });

      navigate('/');
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (preferences?.has_completed_onboarding) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Jobs CRM! 👋</CardTitle>
          <CardDescription>
            Let's set up your preferences to help you track the opportunities that matter most to you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TrackingPreferences />
          <div className="flex justify-end">
            <Button onClick={completeOnboarding}>Complete Setup</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
