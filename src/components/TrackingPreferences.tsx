
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { StagePreferences } from "./preferences/StagePreferences";
import { SectorPreferences } from "./preferences/SectorPreferences";
import { LocationPreferences } from "./preferences/LocationPreferences";
import { OfficePreferences } from "./preferences/OfficePreferences";
import { TrackingPreferences as TrackingPreferencesType, CompanyLocation, CompanySector, OfficePreference } from "./preferences/types";

export function TrackingPreferences() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [availableLocations, setAvailableLocations] = useState<CompanyLocation[]>([]);
  const [availableSectors, setAvailableSectors] = useState<CompanySector[]>([]);
  const [preferences, setPreferences] = useState<TrackingPreferencesType>({
    stages: [],
    sectors: [],
    locations: [],
    office_preferences: []
  });
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPreferences();
    fetchAvailableLocations();
    fetchAvailableSectors();
  }, []);

  const fetchAvailableSectors = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('sector')
        .order('sector');

      if (error) throw error;

      const uniqueSectors = Array.from(new Set(
        data
          .map(company => company.sector)
          .filter((sector): sector is CompanySector => !!sector)
      ));

      setAvailableSectors(uniqueSectors);
    } catch (error: any) {
      console.error('Error fetching available sectors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available sectors.",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('headquarter_location')
        .order('headquarter_location');

      if (error) throw error;

      const uniqueLocations = Array.from(new Set(
        data
          .map(company => company.headquarter_location)
          .filter((location): location is CompanyLocation => !!location)
      ));

      setAvailableLocations(uniqueLocations);
    } catch (error: any) {
      console.error('Error fetching available locations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available locations.",
        variant: "destructive",
      });
    }
  };

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_tracking_preferences')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences(data);
      }
    } catch (error: any) {
      console.error('Error fetching preferences:', error);
      toast({
        title: "Error",
        description: "Failed to fetch preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!session?.user.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_tracking_preferences')
        .upsert({
          user_id: session.user.id,
          stages: preferences.stages,
          sectors: preferences.sectors,
          locations: preferences.locations,
          office_preferences: preferences.office_preferences
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your tracking preferences have been saved.",
      });
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StagePreferences 
        selectedStages={preferences.stages}
        onChange={(stages) => setPreferences(prev => ({ ...prev, stages }))}
      />

      <SectorPreferences
        availableSectors={availableSectors}
        selectedSectors={preferences.sectors}
        onChange={(sectors) => setPreferences(prev => ({ ...prev, sectors }))}
      />

      <LocationPreferences
        availableLocations={availableLocations}
        selectedLocations={preferences.locations}
        onChange={(locations) => setPreferences(prev => ({ ...prev, locations }))}
      />

      <OfficePreferences
        selectedPreference={preferences.office_preferences[0]}
        onChange={(preference: OfficePreference) => 
          setPreferences(prev => ({ ...prev, office_preferences: [preference] }))
        }
      />

      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
