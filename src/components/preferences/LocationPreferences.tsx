
import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CompanyLocation } from "./types";
import { COUNTRY_LOCATIONS } from "./locationTypes";
import { useLocationMappings } from "@/hooks/useLocationMappings";

interface LocationPreferencesProps {
  availableLocations: CompanyLocation[];
  selectedLocations: CompanyLocation[];
  onChange: (locations: CompanyLocation[]) => void;
}

export function LocationPreferences({
  availableLocations,
  selectedLocations,
  onChange,
}: LocationPreferencesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { mappings, isLoading } = useLocationMappings();

  const getLocationDisplay = (location: CompanyLocation): string => {
    return mappings.get(location) || location;
  };

  const renderLocations = (locations: CompanyLocation[]) => (
    <div className="ml-6 space-y-2">
      {locations.map(location => (
        <div key={location} className="flex items-center space-x-2">
          <Checkbox
            id={`location-${location}`}
            checked={selectedLocations.includes(location)}
            onCheckedChange={checked => {
              onChange(
                checked
                  ? [...selectedLocations, location]
                  : selectedLocations.filter(loc => loc !== location)
              );
            }}
          />
          <Label 
            htmlFor={`location-${location}`} 
            className="text-sm"
            title={getLocationDisplay(location)}
          >
            {location} 
            <span className="text-muted-foreground ml-1">
              ({getLocationDisplay(location)})
            </span>
          </Label>
        </div>
      ))}
    </div>
  );

  const renderCountry = (country: string, data: typeof COUNTRY_LOCATIONS[string]) => {
    const allLocations: CompanyLocation[] = [];
    if (data.locations) {
      allLocations.push(...data.locations);
    }
    if (data.regions) {
      Object.values(data.regions).forEach(locations => {
        allLocations.push(...locations);
      });
    }

    // Filter locations based on search query
    const filteredLocations = allLocations.filter(location =>
      location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getLocationDisplay(location).toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredLocations.length === 0) {
      return null;
    }

    const isCountryFullySelected = allLocations.every(loc => 
      selectedLocations.includes(loc)
    );

    const isCountryPartiallySelected = allLocations.some(loc =>
      selectedLocations.includes(loc)
    ) && !isCountryFullySelected;

    return (
      <div key={country} className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`country-${country}`}
            checked={isCountryFullySelected}
            className={isCountryPartiallySelected ? "bg-primary/50" : ""}
            onCheckedChange={checked => {
              onChange(
                checked
                  ? [...new Set([...selectedLocations, ...allLocations])]
                  : selectedLocations.filter(loc => !allLocations.includes(loc))
              );
            }}
          />
          <Label htmlFor={`country-${country}`} className="font-medium">
            {country}
          </Label>
        </div>
        <div className="ml-6 space-y-4">
          {renderLocations(filteredLocations)}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading locations...
              </div>
            ) : (
              Object.entries(COUNTRY_LOCATIONS)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([country, data]) => renderCountry(country, data))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
