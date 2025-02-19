
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
  // Group locations by country/state
  const groupedLocations: LocationStructure = {
    "United States": [
      "Des Moines, IA",
      "Kansas City, MO",
      "Boston, MA",
      "New York, NY",
      "Los Angeles, CA",
      "San Francisco, CA",
      "Chicago, IL",
      "Middletown, DE",
      "Austin, TX",
      "Seattle, WA",
      "Washington, DC",
      "Santa Ana, CA",
      "Brooklyn, NY",
      "San Jose, CA",
      "Redwood City, CA",
      "Woodstock, GA",
      "Denver, CO",
      "Menlo Park, CA",
      "Charlotte, NC",
      "Atlanta, GA",
      "San Mateo, CA",
      "Lehi, UT",
      "Fort Collins, CA",
      "Salt Lake City, UT",
      "Brookline, MA",
      "Palo Alto, CA",
      "Detroit, MI",
      "Santa Cruz, CA",
      "Phoenix, AZ",
      "Newton, CT",
      "Campbell, CA",
      "Omaha, NE",
      "Bend, OR",
      "Oakland, CA",
      "San Rafael, CA",
      "Silver Spring, MD",
      "North Miami Beach, FL",
      "Los Altos, CA",
      "Stamford, CT",
      "Columbus, OH",
      "Sunnyvale, CA",
      "Foster City, CA",
      "Holmdel, NJ",
      "Berwyn, PA",
      "West Palm Beach, Florida",
      "Lewes, DE",
      "West Hollywood, CA",
      "Distributed, United States",
      "Irvine, CA",
      "Portland, OR",
      "Greenwood Village, CO",
      "Redmond, WA",
      "Jersey City, NJ",
      "Miami, FL",
      "Raleigh, NC",
      "Arlington, VA",
      "Youngstown, OH",
      "Canton, MA"
    ],
    "United Kingdom": ["London, UK"],
    "Germany": ["Munich, Germany", "Berlin, Germany", "Karlsruhe, Germany"],
    "Israel": ["Tel Aviv, Israel", "Or Yehuda, Israel"],
    "France": ["Paris, France"],
    "Canada": ["Toronto, Canada"],
    "Colombia": ["Medellín, Colombia"],
    "Sweden": ["Stockholm, Sweden"],
    "Brazil": ["São Paulo, Brazil"],
    "UAE": ["Abu Dhabi, UAE"],
    "Cayman Islands": ["George Town, Cayman Islands"]
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedLocations)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([country, locations]) => renderCountryGroup(country, locations))}
        </div>
      </CardContent>
    </Card>
  );
}
