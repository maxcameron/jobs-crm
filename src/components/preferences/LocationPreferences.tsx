
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CompanyLocation } from "./types";

interface LocationPreferencesProps {
  availableLocations: CompanyLocation[];
  selectedLocations: CompanyLocation[];
  onChange: (locations: CompanyLocation[]) => void;
}

export function LocationPreferences({ availableLocations, selectedLocations, onChange }: LocationPreferencesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Locations</CardTitle>
        <CardDescription>
          Select the locations where companies are based
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {availableLocations.map((location) => (
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
      </CardContent>
    </Card>
  );
}
