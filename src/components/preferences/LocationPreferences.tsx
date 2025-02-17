import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const handleRegionChange = (region: string, checked: boolean) => {
    const regionLocations = groupedLocations[region];
    if (checked) {
      // Add all locations from the region that aren't already selected
      const newLocations = [
        ...selectedLocations,
        ...regionLocations.filter(loc => !selectedLocations.includes(loc))
      ];
      onChange(newLocations);
    } else {
      // Remove all locations from this region
      const newLocations = selectedLocations.filter(
        loc => !regionLocations.includes(loc)
      );
      onChange(newLocations);
    }
  };

  const isRegionFullySelected = (region: string) => {
    const regionLocations = groupedLocations[region];
    return regionLocations.every(loc => selectedLocations.includes(loc));
  };

  const isRegionPartiallySelected = (region: string) => {
    const regionLocations = groupedLocations[region];
    const selectedCount = regionLocations.filter(loc => 
      selectedLocations.includes(loc)
    ).length;
    return selectedCount > 0 && selectedCount < regionLocations.length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedLocations).map(([region, locations]) => (
            <div key={region} className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`region-${region}`}
                  checked={isRegionFullySelected(region)}
                  className={isRegionPartiallySelected(region) ? "bg-primary/50" : ""}
                  onCheckedChange={(checked) => handleRegionChange(region, checked as boolean)}
                />
                <Label htmlFor={`region-${region}`} className="font-medium text-sm">{region}</Label>
              </div>
              <div className="grid gap-4 ml-6">
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
