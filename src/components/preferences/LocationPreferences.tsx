
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
    const country = getCountry(location);
    if (!groups[country]) {
      groups[country] = [];
    }
    groups[country].push(location);
    return groups;
  }, {} as Record<string, CompanyLocation[]>);

  const handleCountryChange = (country: string, checked: boolean) => {
    const countryLocations = groupedLocations[country];
    if (checked) {
      // Add all locations from the country that aren't already selected
      const newLocations = [
        ...selectedLocations,
        ...countryLocations.filter(loc => !selectedLocations.includes(loc))
      ];
      onChange(newLocations);
    } else {
      // Remove all locations from this country
      const newLocations = selectedLocations.filter(
        loc => !countryLocations.includes(loc)
      );
      onChange(newLocations);
    }
  };

  const isCountryFullySelected = (country: string) => {
    const countryLocations = groupedLocations[country];
    return countryLocations.every(loc => selectedLocations.includes(loc));
  };

  const isCountryPartiallySelected = (country: string) => {
    const countryLocations = groupedLocations[country];
    const selectedCount = countryLocations.filter(loc => 
      selectedLocations.includes(loc)
    ).length;
    return selectedCount > 0 && selectedCount < countryLocations.length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedLocations).map(([country, locations]) => (
            <div key={country} className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country}`}
                  checked={isCountryFullySelected(country)}
                  className={isCountryPartiallySelected(country) ? "bg-primary/50" : ""}
                  onCheckedChange={(checked) => handleCountryChange(country, checked as boolean)}
                />
                <Label htmlFor={`country-${country}`} className="font-medium text-sm">{country}</Label>
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

// Helper function to group locations by country
function getCountry(location: CompanyLocation): string {
  const locationMap: Record<string, string> = {
    "New York": "United States",
    "San Francisco": "United States",
    "Boston": "United States",
    "Austin": "United States",
    "Seattle": "United States",
    "Chicago": "United States",
    "Los Angeles": "United States",
    "Miami": "United States",
    "Vancouver": "Canada",
    "London": "United Kingdom",
    "Berlin": "Germany",
    "Paris": "France",
    "Amsterdam": "Netherlands",
    "Dublin": "Ireland",
    "Stockholm": "Sweden",
    "Singapore": "Singapore",
    "Sydney": "Australia",
    "Tokyo": "Japan",
    "Tel Aviv": "Israel"
  };

  return locationMap[location] || location;
}
