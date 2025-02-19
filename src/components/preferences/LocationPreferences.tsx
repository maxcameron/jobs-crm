import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CompanyLocation } from "./types";
import { COUNTRY_LOCATIONS } from "./locationTypes";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const [expandedCountries, setExpandedCountries] = useState<string[]>(["United States"]);
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);

  const toggleCountry = (country: string) => {
    setExpandedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const toggleRegion = (region: string) => {
    setExpandedRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handleCountryChange = (country: string, checked: boolean) => {
    const countryData = COUNTRY_LOCATIONS[country];
    let locationsToUpdate: CompanyLocation[] = [];

    if (countryData.regions) {
      Object.values(countryData.regions).forEach(regionLocations => {
        locationsToUpdate.push(...regionLocations);
      });
    }
    if (countryData.locations) {
      locationsToUpdate.push(...countryData.locations);
    }

    if (checked) {
      const newLocations = [
        ...selectedLocations,
        ...locationsToUpdate.filter(loc => !selectedLocations.includes(loc)),
      ];
      onChange(newLocations);
    } else {
      const newLocations = selectedLocations.filter(
        loc => !locationsToUpdate.includes(loc)
      );
      onChange(newLocations);
    }
  };

  const handleRegionChange = (country: string, region: string, checked: boolean) => {
    const regionLocations = COUNTRY_LOCATIONS[country].regions?.[region] || [];
    
    if (checked) {
      const newLocations = [
        ...selectedLocations,
        ...regionLocations.filter(loc => !selectedLocations.includes(loc)),
      ];
      onChange(newLocations);
    } else {
      const newLocations = selectedLocations.filter(
        loc => !regionLocations.includes(loc)
      );
      onChange(newLocations);
    }
  };

  const isCountryFullySelected = (country: string) => {
    const countryData = COUNTRY_LOCATIONS[country];
    let allLocations: CompanyLocation[] = [];

    if (countryData.regions) {
      Object.values(countryData.regions).forEach(regionLocations => {
        allLocations.push(...regionLocations);
      });
    }
    if (countryData.locations) {
      allLocations.push(...countryData.locations);
    }

    return (
      allLocations.length > 0 &&
      allLocations.every(loc => selectedLocations.includes(loc))
    );
  };

  const isRegionFullySelected = (country: string, region: string) => {
    const regionLocations = COUNTRY_LOCATIONS[country].regions?.[region] || [];
    return (
      regionLocations.length > 0 &&
      regionLocations.every(loc => selectedLocations.includes(loc))
    );
  };

  const isCountryPartiallySelected = (country: string) => {
    const countryData = COUNTRY_LOCATIONS[country];
    let allLocations: CompanyLocation[] = [];

    if (countryData.regions) {
      Object.values(countryData.regions).forEach(regionLocations => {
        allLocations.push(...regionLocations);
      });
    }
    if (countryData.locations) {
      allLocations.push(...countryData.locations);
    }

    const selectedCount = allLocations.filter(loc =>
      selectedLocations.includes(loc)
    ).length;
    return selectedCount > 0 && selectedCount < allLocations.length;
  };

  const isRegionPartiallySelected = (country: string, region: string) => {
    const regionLocations = COUNTRY_LOCATIONS[country].regions?.[region] || [];
    const selectedCount = regionLocations.filter(loc =>
      selectedLocations.includes(loc)
    ).length;
    return selectedCount > 0 && selectedCount < regionLocations.length;
  };

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return COUNTRY_LOCATIONS;

    const filtered: typeof COUNTRY_LOCATIONS = {};
    const searchLower = searchQuery.toLowerCase();

    Object.entries(COUNTRY_LOCATIONS).forEach(([country, data]) => {
      const countryMatch = country.toLowerCase().includes(searchLower);
      
      if (data.regions) {
        const filteredRegions: Record<string, CompanyLocation[]> = {};
        
        Object.entries(data.regions).forEach(([region, locations]) => {
          const regionMatch = region.toLowerCase().includes(searchLower);
          const filteredLocs = locations.filter(loc =>
            loc.toLowerCase().includes(searchLower)
          );
          
          if (regionMatch || filteredLocs.length > 0) {
            filteredRegions[region] = locations;
          }
        });
        
        if (countryMatch || Object.keys(filteredRegions).length > 0) {
          filtered[country] = { regions: filteredRegions };
        }
      }
      
      if (data.locations) {
        const filteredLocs = data.locations.filter(loc =>
          loc.toLowerCase().includes(searchLower)
        );
        if (countryMatch || filteredLocs.length > 0) {
          filtered[country] = { locations: data.locations };
        }
      }
    });

    return filtered;
  }, [searchQuery]);

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
          <Label htmlFor={`location-${location}`} className="text-sm">
            {location}
          </Label>
        </div>
      ))}
    </div>
  );

  const renderRegion = (country: string, region: string, locations: CompanyLocation[]) => (
    <div key={region} className="ml-6">
      <div className="flex items-center space-x-2 mb-2">
        <Checkbox
          id={`region-${region}`}
          checked={isRegionFullySelected(country, region)}
          className={isRegionPartiallySelected(country, region) ? "bg-primary/50" : ""}
          onCheckedChange={checked => handleRegionChange(country, region, checked as boolean)}
        />
        <Label htmlFor={`region-${region}`} className="font-medium">
          {region} ({locations.length})
        </Label>
      </div>
      {renderLocations(locations)}
    </div>
  );

  const renderCountry = (country: string, data: typeof COUNTRY_LOCATIONS[string]) => (
    <div key={country} className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`country-${country}`}
          checked={isCountryFullySelected(country)}
          className={isCountryPartiallySelected(country) ? "bg-primary/50" : ""}
          onCheckedChange={checked => handleCountryChange(country, checked as boolean)}
        />
        <Label htmlFor={`country-${country}`} className="font-medium">
          {country}
        </Label>
      </div>
      <div className="ml-6 space-y-4">
        {data.regions ? (
          Object.entries(data.regions).map(([region, locations]) =>
            renderRegion(country, region, locations)
          )
        ) : (
          data.locations && renderLocations(data.locations)
        )}
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
            {Object.entries(filteredLocations)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([country, data]) => renderCountry(country, data))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
