
import { StagePreferences } from "@/components/preferences/StagePreferences";
import { SectorPreferences } from "@/components/preferences/SectorPreferences";
import { LocationPreferences } from "@/components/preferences/LocationPreferences";
import { OfficePreferences } from "@/components/preferences/OfficePreferences";
import { CompanyStage, CompanySector, CompanyLocation, OfficePreference } from "@/components/preferences/types";
import { OnboardingStep } from "./types";
import { useSectors } from "@/hooks/useSectors";
import { useLocations } from "@/hooks/useLocations";
import { Loader2 } from "lucide-react";

interface StepContentProps {
  step: OnboardingStep;
  preferences: {
    stages: CompanyStage[];
    sectors: CompanySector[];
    locations: CompanyLocation[];
    office_preferences: OfficePreference[];
  };
  setPreferences: (preferences: any) => void;
}

export function StepContent({ 
  step, 
  preferences, 
  setPreferences,
}: StepContentProps) {
  const { sectors: availableSectors, isLoading: isLoadingSectors } = useSectors();
  const { locations: availableLocations, isLoading: isLoadingLocations } = useLocations();

  switch (step.component) {
    case "stages":
      return (
        <StagePreferences
          selectedStages={preferences.stages}
          onChange={(stages) => setPreferences((prev: any) => ({ ...prev, stages }))}
        />
      );
    case "sectors":
      if (isLoadingSectors) {
        return (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        );
      }
      return (
        <SectorPreferences
          availableSectors={availableSectors}
          selectedSectors={preferences.sectors}
          onChange={(sectors) => setPreferences((prev: any) => ({ ...prev, sectors }))}
        />
      );
    case "locations":
      if (isLoadingLocations) {
        return (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        );
      }
      return (
        <LocationPreferences
          availableLocations={availableLocations}
          selectedLocations={preferences.locations}
          onChange={(locations) => setPreferences((prev: any) => ({ ...prev, locations }))}
        />
      );
    case "office":
      return (
        <OfficePreferences
          selectedPreference={preferences.office_preferences}
          onChange={(office_preferences) => 
            setPreferences((prev: any) => ({ ...prev, office_preferences }))
          }
        />
      );
    default:
      return null;
  }
}
