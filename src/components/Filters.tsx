
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FiltersProps {
  selectedSector: string;
  selectedStage: string;
  onSectorChange: (sector: string) => void;
  onStageChange: (stage: string) => void;
}

export const Filters = ({
  selectedSector,
  selectedStage,
  onSectorChange,
  onStageChange,
}: FiltersProps) => {
  const sectors = ["Tech", "Finance", "Healthcare", "All"];
  const stages = ["Seed", "Series A", "Series B", "All"];

  return (
    <div className="space-y-4 animate-slideIn">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <h3 className="text-sm font-medium">Filters</h3>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Sector</label>
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <Button
                key={sector}
                variant={selectedSector === sector ? "default" : "outline"}
                size="sm"
                onClick={() => onSectorChange(sector)}
                className="transition-all duration-200"
              >
                {sector}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Stage</label>
          <div className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <Button
                key={stage}
                variant={selectedStage === stage ? "default" : "outline"}
                size="sm"
                onClick={() => onStageChange(stage)}
                className="transition-all duration-200"
              >
                {stage}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
