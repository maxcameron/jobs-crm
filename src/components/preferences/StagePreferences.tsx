
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CompanyStage, COMPANY_STAGES } from "./types";

interface StagePreferencesProps {
  selectedStages: CompanyStage[];
  onChange: (stages: CompanyStage[]) => void;
}

export function StagePreferences({ selectedStages, onChange }: StagePreferencesProps) {
  const handleStageChange = (stage: CompanyStage, checked: boolean) => {
    if (checked) {
      onChange([...selectedStages, stage]);
    } else {
      onChange(selectedStages.filter((s) => s !== stage));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funding Stage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {COMPANY_STAGES.map((stage) => (
            <div key={stage} className="flex items-center space-x-2">
              <Checkbox
                id={stage}
                checked={selectedStages.includes(stage)}
                onCheckedChange={(checked) => handleStageChange(stage, checked as boolean)}
              />
              <Label htmlFor={stage} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {stage}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
