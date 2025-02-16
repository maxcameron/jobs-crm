
import { StagePreferences } from "@/components/preferences/StagePreferences";
import { SectorPreferences } from "@/components/preferences/SectorPreferences";
import { LocationPreferences } from "@/components/preferences/LocationPreferences";
import { OfficePreferences } from "@/components/preferences/OfficePreferences";
import { CompanyStage, CompanySector, CompanyLocation, OfficePreference } from "@/components/preferences/types";
import { OnboardingStep } from "./types";

interface StepContentProps {
  step: OnboardingStep;
  preferences: {
    stages: CompanyStage[];
    sectors: CompanySector[];
    locations: CompanyLocation[];
    office_preferences: OfficePreference[];
  };
  setPreferences: (preferences: any) => void;
  availableSectors?: CompanySector[];
  availableLocations?: CompanyLocation[];
}

export function StepContent({ 
  step, 
  preferences, 
  setPreferences,
  availableSectors = [],
  availableLocations = []
}: StepContentProps) {
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
          availableSectors={availableSectors}
          selectedSectors={preferences.sectors}
          onChange={(sectors) => setPreferences(prev => ({ ...prev, sectors }))}
        />
      );
    case "locations":
      return (
        <LocationPreferences
          availableLocations={availableLocations}
          selectedLocations={preferences.locations}
          onChange={(locations) => setPreferences(prev => ({ ...prev, locations }))}
        />
      );
    case "office":
      return (
        <OfficePreferences
          selectedPreference={preferences.office_preferences}
          onChange={(office_preferences) => 
            setPreferences(prev => ({ ...prev, office_preferences }))
          }
        />
      );
    default:
      return null;
  }
}
