
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { OFFICE_PREFERENCES, OfficePreference } from "./types";

interface OfficePreferencesProps {
  selectedPreference: OfficePreference[] | undefined;
  onChange: (preferences: OfficePreference[]) => void;
}

export function OfficePreferences({ selectedPreference = [], onChange }: OfficePreferencesProps) {
  const handleCheckboxChange = (preference: OfficePreference, checked: boolean) => {
    if (checked) {
      onChange([...selectedPreference, preference]);
    } else {
      onChange(selectedPreference.filter(p => p !== preference));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {OFFICE_PREFERENCES.map((preference) => (
            <div key={preference} className="flex items-center space-x-2">
              <Checkbox
                id={`office-${preference}`}
                checked={selectedPreference.includes(preference)}
                onCheckedChange={(checked) => {
                  console.log('Checkbox changed:', preference, checked);
                  handleCheckboxChange(preference, checked === true);
                }}
              />
              <Label htmlFor={`office-${preference}`}>{preference}</Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
