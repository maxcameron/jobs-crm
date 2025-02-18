import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CompanyLocation } from "./types";

interface LocationPreferencesProps {
  availableLocations: CompanyLocation[];
  selectedLocations: CompanyLocation[];
  onChange: (locations: CompanyLocation[]) => void;
}

interface LocationStructure {
  [key: string]: CompanyLocation[];
}

export function LocationPreferences({ availableLocations, selectedLocations, onChange }: LocationPreferencesProps) {
  // Group locations by country
  const groupedLocations: LocationStructure = {
    "United States": [
      "New York",
      "San Francisco",
      "Boston",
      "Austin",
      "Seattle",
      "Chicago",
      "Los Angeles",
      "Miami",
    ],
    "Canada": ["Vancouver", "Toronto"],
    "United Kingdom": ["London"],
    "Germany": ["Berlin"],
    "France": ["Paris"],
    "Netherlands": ["Amsterdam"],
    "Ireland": ["Dublin"],
    "Sweden": ["Stockholm"],
    "Singapore": ["Singapore"],
    "Australia": ["Sydney"],
    "Japan": ["Tokyo"],
    "Israel": ["Tel Aviv"],
  };

  const handleCountryChange = (country: string, checked: boolean) => {
    const countryLocations = groupedLocations[country] || [];
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
    const countryLocations = groupedLocations[country] || [];
    return countryLocations.length > 0 && 
           countryLocations.every(loc => selectedLocations.includes(loc));
  };

  const isCountryPartiallySelected = (country: string) => {
    const countryLocations = groupedLocations[country] || [];
    const selectedCount = countryLocations.filter(loc => 
      selectedLocations.includes(loc)
    ).length;
    return selectedCount > 0 && selectedCount < countryLocations.length;
  };

  // Function to render single location that isn't part of a country group
  const renderSingleLocation = (location: CompanyLocation) => (
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
  );

  // Function to render a country group with its cities
  const renderCountryGroup = (country: string, locations: CompanyLocation[]) => (
    <div key={country} className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`country-${country}`}
          checked={isCountryFullySelected(country)}
          className={isCountryPartiallySelected(country) ? "bg-primary/50" : ""}
          onCheckedChange={(checked) => handleCountryChange(country, checked as boolean)}
        />
        <Label htmlFor={`country-${country}`} className="font-medium">{country}</Label>
      </div>
      <div className="ml-6 space-y-2">
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
  );

  // Get locations that aren't part of any country group
  const ungroupedLocations = availableLocations.filter(location => 
    !Object.values(groupedLocations).flat().includes(location)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Render single locations first */}
          {ungroupedLocations.map(location => renderSingleLocation(location))}
          
          {/* Render country groups */}
          {Object.entries(groupedLocations)
            .sort(([a], [b]) => a.localeCompare(b)) // Sort countries alphabetically
            .map(([country, locations]) => renderCountryGroup(country, locations))}
        </div>
      </CardContent>
    </Card>
  );
}
