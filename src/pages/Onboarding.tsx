import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { STEPS } from "./onboarding/types";
import { ProgressIndicator } from "./onboarding/ProgressIndicator";
import { StepContent } from "./onboarding/StepContent";
import { CompanyStage, CompanySector, CompanyLocation, OfficePreference } from "@/components/preferences/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const Onboarding = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState<{
    stages: CompanyStage[];
    sectors: CompanySector[];
    locations: CompanyLocation[];
    office_preferences: OfficePreference[];
  }>({
    stages: [],
    sectors: [],
    locations: [],
    office_preferences: []
  });

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  const currentStepData = STEPS[currentStep];

  const isNextDisabled = () => {
    switch (currentStepData.component) {
      case "stages":
        return preferences.stages.length === 0;
      case "sectors":
        return preferences.sectors.length === 0;
      case "locations":
        return preferences.locations.length === 0;
      case "office":
        return preferences.office_preferences.length === 0;
      default:
        return false;
    }
  };

  const verifyPreferencesSaved = async (userId: string): Promise<boolean> => {
    console.log("[Onboarding] Verifying preferences for user:", userId);
    
    const { data, error } = await supabase
      .from('user_tracking_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error("[Onboarding] Error verifying preferences:", error);
      return false;
    }

    console.log("[Onboarding] Verification data from DB:", data);
    return data?.has_completed_onboarding === true;
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // This is the last step, save preferences and redirect
    setIsSubmitting(true);
    console.log("[Onboarding] Starting preferences save...");
    
    try {
      const preferencesData = {
        stages: preferences.stages,
        sectors: preferences.sectors,
        locations: preferences.locations,
        office_preferences: preferences.office_preferences,
        has_completed_onboarding: true,
        user_id: session.user.id
      };

      console.log("[Onboarding] Saving preferences data:", preferencesData);

      const { data, error } = await supabase
        .from('user_tracking_preferences')
        .upsert(preferencesData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select();

      if (error) throw error;

      console.log("[Onboarding] Upsert response:", data);

      // Verify the preferences were saved
      const isVerified = await verifyPreferencesSaved(session.user.id);
      
      console.log("[Onboarding] Preferences verification result:", isVerified);

      if (!isVerified) {
        throw new Error("Failed to verify preferences were saved");
      }

      // Invalidate the preferences query to force a fresh fetch
      console.log("[Onboarding] Invalidating preferences cache");
      await queryClient.invalidateQueries({ queryKey: ['preferences', session.user.id] });

      // Force an immediate refetch
      await queryClient.refetchQueries({ queryKey: ['preferences', session.user.id] });

      console.log("[Onboarding] Cache invalidated and refetched");

      toast({
        title: "Success",
        description: "Your preferences have been saved.",
      });

      // Use a short delay to ensure the database update is processed
      console.log("[Onboarding] Preparing for navigation...");
      setTimeout(() => {
        console.log("[Onboarding] Navigating to home...");
        navigate('/', { replace: true });
      }, 1000);

    } catch (error) {
      console.error("[Onboarding] Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container max-w-2xl py-8 px-4">
      <ProgressIndicator currentStep={currentStep} totalSteps={STEPS.length} />
      
      <div className="mt-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{currentStepData.title}</h1>
          <p className="text-muted-foreground mt-1">{currentStepData.description}</p>
        </div>

        <StepContent 
          step={currentStepData}
          preferences={preferences}
          setPreferences={setPreferences}
        />

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={isNextDisabled() || isSubmitting}
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                {isSubmitting ? 'Saving...' : 'Finish'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
