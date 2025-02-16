
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CompanySector } from "./types";

interface SectorPreferencesProps {
  availableSectors: CompanySector[];
  selectedSectors: CompanySector[];
  onChange: (sectors: CompanySector[]) => void;
}

export function SectorPreferences({ availableSectors, selectedSectors, onChange }: SectorPreferencesProps) {
  return (
    <Card>
      <CardContent className="pt-6 grid gap-4">
        {availableSectors.map((sector) => (
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
