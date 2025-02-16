
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { COMPANY_SECTORS, CompanySector } from "./types";

interface SectorPreferencesProps {
  selectedSectors: CompanySector[];
  onChange: (sectors: CompanySector[]) => void;
}

export function SectorPreferences({ selectedSectors, onChange }: SectorPreferencesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Sector</CardTitle>
        <CardDescription>
          Select the sectors you're interested in tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {COMPANY_SECTORS.map((sector) => (
          <div key={sector} className="flex items-center space-x-2">
            <Checkbox
              id={`sector-${sector}`}
              checked={selectedSectors.includes(sector)}
              onCheckedChange={(checked) => {
                onChange(
                  checked
                    ? [...selectedSectors, sector]
                    : selectedSectors.filter(s => s !== sector)
                );
              }}
            />
            <Label htmlFor={`sector-${sector}`}>{sector}</Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
