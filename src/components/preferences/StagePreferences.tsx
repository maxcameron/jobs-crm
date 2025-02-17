
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CompanyStage, COMPANY_STAGES } from "./types";

interface StagePreferencesProps {
  selectedStages: CompanyStage[];
  onChange: (stages: CompanyStage[]) => void;
}

export function StagePreferences({ selectedStages, onChange }: StagePreferencesProps) {
  const handleStageChange = (stage: CompanyStage) => {
    if (selectedStages.includes(stage)) {
      onChange(selectedStages.filter((s) => s !== stage));
    } else {
      onChange([...selectedStages, stage]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funding Stage</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup className="space-y-4">
          {COMPANY_STAGES.map((stage) => (
            <div key={stage} className="flex items-center space-x-2">
              <RadioGroupItem
                id={stage}
                value={stage}
                checked={selectedStages.includes(stage)}
                onClick={() => handleStageChange(stage)}
              />
              <Label htmlFor={stage}>{stage}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
