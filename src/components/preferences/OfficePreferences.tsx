
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { OFFICE_PREFERENCES, OfficePreference } from "./types";

interface OfficePreferencesProps {
  selectedPreference: OfficePreference | undefined;
  onChange: (preference: OfficePreference) => void;
}

export function OfficePreferences({ selectedPreference, onChange }: OfficePreferencesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Office Preference</CardTitle>
        <CardDescription>
          Select your preferred work arrangements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedPreference || ""}
          onValueChange={(value: OfficePreference) => onChange(value)}
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
  );
}
