
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyStage, CompanySector, CompanyLocation, OfficePreference } from "@/components/preferences/types";
import { StepContent } from "./onboarding/StepContent";
import { ProgressIndicator } from "./onboarding/ProgressIndicator";
import { STEPS } from "./onboarding/types";

const Onboarding = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    stages: [] as CompanyStage[],
    sectors: [] as CompanySector[],
    locations: [] as CompanyLocation[],
    office_preferences: [] as OfficePreference[]
  });

  const isCurrentStepValid = () => {
    switch (STEPS[currentStep].component) {
      case "stages":
        return preferences.stages.length > 0;
      case "sectors":
        return preferences.sectors.length > 0;
      case "locations":
        return preferences.locations.length > 0;
      case "office":
        return preferences.office_preferences.length > 0;
      default:
        return false;
    }
  };

  const { data: availableData, isLoading } = useQuery({
    queryKey: ['preferences-data'],
    queryFn: async () => {
      const { data: sectorsData, error: sectorsError } = await supabase
        .from('companies')
        .select('sector')
        .order('sector');

      const { data: locationsData, error: locationsError } = await supabase
        .from('companies')
        .select('headquarter_location')
        .order('headquarter_location');

      if (sectorsError || locationsError) throw sectorsError || locationsError;

      const uniqueSectors = Array.from(new Set(
        sectorsData
          .map(company => company.sector)
          .filter((sector): sector is CompanySector => !!sector)
      ));

      const uniqueLocations = Array.from(new Set(
        locationsData
          .map(company => company.headquarter_location)
          .filter((location): location is CompanyLocation => !!location)
      ));

      return {
        sectors: uniqueSectors,
        locations: uniqueLocations
      };
    }
  });

  const handleNext = async () => {
    if (currentStep === STEPS.length - 1) {
      try {
        const { error } = await supabase
          .from('user_tracking_preferences')
          .upsert({
            user_id: session?.user.id,
            ...preferences,
            has_completed_onboarding: true
          });

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
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
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

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <ProgressIndicator 
            currentStep={currentStep} 
            totalSteps={STEPS.length} 
          />
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
          <CardDescription>
            {STEPS[currentStep].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepContent
            step={STEPS[currentStep]}
            preferences={preferences}
            setPreferences={setPreferences}
            availableSectors={availableData?.sectors}
            availableLocations={availableData?.locations}
          />
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
            >
              {currentStep === STEPS.length - 1 ? "Complete Setup" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
