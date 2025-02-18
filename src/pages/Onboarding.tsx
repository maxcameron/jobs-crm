
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

const Onboarding = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
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
    console.log('Checking next disabled:', {
      component: currentStepData.component,
      preferences: preferences
    });
    
    switch (currentStepData.component) {
      case "stages":
        return preferences.stages.length === 0;
      case "sectors":
        return preferences.sectors.length === 0;
      case "locations":
        return preferences.locations.length === 0;
      case "office":
        console.log('Office preferences length:', preferences.office_preferences.length);
        return preferences.office_preferences.length === 0;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // This is the last step, save preferences and redirect
      try {
        const { error: preferencesError } = await supabase
          .from('user_tracking_preferences')
          .upsert({
            user_id: session.user.id,
            stages: preferences.stages,
            sectors: preferences.sectors,
            locations: preferences.locations,
            office_preferences: preferences.office_preferences,
            has_completed_onboarding: true
          });

        if (preferencesError) {
          console.error('Error saving preferences:', preferencesError);
          return;
        }

        // Redirect to index page after successful save
        navigate('/');
      } catch (error) {
        console.error('Error in handleNext:', error);
      }
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
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={isNextDisabled()}
          >
            {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
