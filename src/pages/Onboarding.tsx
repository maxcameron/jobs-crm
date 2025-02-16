import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StagePreferences } from "@/components/preferences/StagePreferences";
import { SectorPreferences } from "@/components/preferences/SectorPreferences";
import { LocationPreferences } from "@/components/preferences/LocationPreferences";
import { OfficePreferences } from "@/components/preferences/OfficePreferences";
import { CompanyStage, CompanySector, CompanyLocation, OfficePreference } from "@/components/preferences/types";

const STEPS = [
  {
    title: "Company Stage",
    description: "What stage companies are you interested in?",
    component: "stages"
  },
  {
    title: "Industry Sectors",
    description: "Which sectors interest you the most?",
    component: "sectors"
  },
  {
    title: "Locations",
    description: "Where would you like to work?",
    component: "locations"
  },
  {
    title: "Work Arrangement",
    description: "What's your preferred work arrangement?",
    component: "office"
  }
];

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

  const progress = ((currentStep + 1) / STEPS.length) * 100;

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

  const renderStep = () => {
    const step = STEPS[currentStep];

    switch (step.component) {
      case "stages":
        return (
          <StagePreferences
            selectedStages={preferences.stages}
            onChange={(stages) => setPreferences(prev => ({ ...prev, stages }))}
          />
        );
      case "sectors":
        return (
          <SectorPreferences
            availableSectors={availableData?.sectors || []}
            selectedSectors={preferences.sectors}
            onChange={(sectors) => setPreferences(prev => ({ ...prev, sectors }))}
          />
        );
      case "locations":
        return (
          <LocationPreferences
            availableLocations={availableData?.locations || []}
            selectedLocations={preferences.locations}
            onChange={(locations) => setPreferences(prev => ({ ...prev, locations }))}
          />
        );
      case "office":
        return (
          <OfficePreferences
            selectedPreference={preferences.office_preferences[0]}
            onChange={(preference) => 
              setPreferences(prev => ({ ...prev, office_preferences: [preference] }))
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {STEPS.length}
            </div>
          </div>
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
          <CardDescription>
            {STEPS[currentStep].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}
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
