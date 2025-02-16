
import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Database } from "@/integrations/supabase/types";

type CompanyStage = Database["public"]["Enums"]["company_stage"];
type CompanySector = Database["public"]["Enums"]["company_sector"];
type OfficePreference = Database["public"]["Enums"]["office_preference"];

const COMPANY_STAGES: CompanyStage[] = [
  "Seed", "Series A", "Series B", "Series C", "Series D", "Series E and above"
];

const COMPANY_SECTORS: CompanySector[] = [
  "Artificial Intelligence (AI)",
  "Fintech",
  "HealthTech",
  "E-commerce & RetailTech",
  "Sales Tech & RevOps",
  "HR Tech & WorkTech",
  "PropTech (Real Estate Tech)",
  "LegalTech",
  "EdTech",
  "Cybersecurity",
  "Logistics & Supply Chain Tech",
  "Developer Tools & Web Infrastructure",
  "SaaS & Enterprise Software",
  "Marketing Tech (MarTech)",
  "InsurTech",
  "GovTech",
  "Marketplace Platforms",
  "Construction Tech & Fintech",
  "Mobility & Transportation Tech",
  "CleanTech & ClimateTech"
];

const OFFICE_PREFERENCES: OfficePreference[] = ["Full-time Office", "Hybrid", "Remote"];

interface TrackingPreferences {
  stages: CompanyStage[];
  sectors: CompanySector[];
  locations: string[];
  office_preferences: OfficePreference[];
}

export function TrackingPreferences() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<TrackingPreferences>({
    stages: [],
    sectors: [],
    locations: [],
    office_preferences: []
  });
  const [location, setLocation] = useState("");
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_tracking_preferences')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setPreferences(data);
      }
    } catch (error: any) {
      console.error('Error fetching preferences:', error);
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

  const addLocation = () => {
    if (location && !preferences.locations.includes(location)) {
      setPreferences(prev => ({
        ...prev,
        locations: [...prev.locations, location]
      }));
      setLocation("");
    }
  };

  const removeLocation = (locationToRemove: string) => {
    setPreferences(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc !== locationToRemove)
    }));
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
      <Card>
        <CardHeader>
          <CardTitle>Company Stage</CardTitle>
          <CardDescription>
            Select the funding stages you're interested in tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {COMPANY_STAGES.map((stage) => (
            <div key={stage} className="flex items-center space-x-2">
              <Checkbox
                id={`stage-${stage}`}
                checked={preferences.stages.includes(stage)}
                onCheckedChange={(checked) => {
                  setPreferences(prev => ({
                    ...prev,
                    stages: checked
                      ? [...prev.stages, stage]
                      : prev.stages.filter(s => s !== stage)
                  }));
                }}
              />
              <Label htmlFor={`stage-${stage}`}>{stage}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Sector</CardTitle>
          <CardDescription>
            Select the sectors you're interested in tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {COMPANY_SECTORS.map((sector) => (
            <div key={sector} className="flex items-center space-x-2">
              <Checkbox
                id={`sector-${sector}`}
                checked={preferences.sectors.includes(sector)}
                onCheckedChange={(checked) => {
                  setPreferences(prev => ({
                    ...prev,
                    sectors: checked
                      ? [...prev.sectors, sector]
                      : prev.sectors.filter(s => s !== sector)
                  }));
                }}
              />
              <Label htmlFor={`sector-${sector}`}>{sector}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Locations</CardTitle>
          <CardDescription>
            Add the locations you're interested in tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a location (e.g., New York, London)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLocation();
                }
              }}
            />
            <Button onClick={addLocation}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.locations.map((loc) => (
              <div
                key={loc}
                className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full"
              >
                <span>{loc}</span>
                <button
                  onClick={() => removeLocation(loc)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Office Preference</CardTitle>
          <CardDescription>
            Select your preferred work arrangements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={preferences.office_preferences[0] || ""}
            onValueChange={(value: OfficePreference) => {
              setPreferences(prev => ({
                ...prev,
                office_preferences: [value]
              }));
            }}
          >
            {OFFICE_PREFERENCES.map((preference) => (
              <div key={preference} className="flex items-center space-x-2">
                <RadioGroupItem value={preference} id={`office-${preference}`} />
                <Label htmlFor={`office-${preference}`}>{preference}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
