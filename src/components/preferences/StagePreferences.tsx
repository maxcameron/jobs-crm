
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { COMPANY_STAGES, CompanyStage } from "./types";

interface StagePreferencesProps {
  selectedStages: CompanyStage[];
  onChange: (stages: CompanyStage[]) => void;
}

export function StagePreferences({ selectedStages, onChange }: StagePreferencesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Stage</CardTitle>
        <CardDescription>
          Select the funding stages you're interested in tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {COMPANY_STAGES.map((stage) => (
          <div key={stage} className="flex items-center space-x-2">
            <Checkbox
              id={`stage-${stage}`}
              checked={selectedStages.includes(stage)}
              onCheckedChange={(checked) => {
                onChange(
                  checked
                    ? [...selectedStages, stage]
                    : selectedStages.filter(s => s !== stage)
                );
              }}
            />
            <Label htmlFor={`stage-${stage}`}>{stage}</Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
