
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CompanyLocation } from "./types";

interface LocationPreferencesProps {
  availableLocations: CompanyLocation[];
  selectedLocations: CompanyLocation[];
  onChange: (locations: CompanyLocation[]) => void;
}

export function LocationPreferences({ availableLocations, selectedLocations, onChange }: LocationPreferencesProps) {
  // Group locations by region to help users make better decisions
  const groupedLocations = availableLocations.reduce((groups, location) => {
    const region = getRegion(location);
    if (!groups[region]) {
      groups[region] = [];
    }
    groups[region].push(location);
    return groups;
  }, {} as Record<string, CompanyLocation[]>);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {Object.entries(groupedLocations).map(([region, locations]) => (
            <div key={region} className="space-y-3">
              <div className="font-medium text-sm text-muted-foreground">{region}</div>
              <div className="grid gap-4">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={selectedLocations.includes(location)}
                      onCheckedChange={(checked) => {
                        onChange(
                          checked
                            ? [...selectedLocations, location]
                            : selectedLocations.filter(loc => loc !== location)
                        );
                      }}
                    />
                    <Label htmlFor={`location-${location}`}>{location}</Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to group locations by region
function getRegion(location: CompanyLocation): string {
  const northAmerica = ["New York", "San Francisco", "Boston", "Austin", "Seattle", "Chicago", "Los Angeles", "Miami", "Vancouver"];
  const europe = ["London", "Berlin", "Paris", "Amsterdam", "Dublin", "Stockholm"];
  const asiaPacific = ["Singapore", "Sydney", "Tokyo"];
  const middleEast = ["Tel Aviv"];

  if (northAmerica.includes(location)) return "North America";
  if (europe.includes(location)) return "Europe";
  if (asiaPacific.includes(location)) return "Asia Pacific";
  if (middleEast.includes(location)) return "Middle East";
  return "Other";
}
