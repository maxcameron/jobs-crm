
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Target, ChartBar } from "lucide-react";

interface CompanyCardProps {
  name: string;
  sector: string;
  stage: string;
  description: string;
}

export const CompanyCard = ({ name, sector, stage, description }: CompanyCardProps) => {
  return (
    <Card className="group transition-all duration-300 hover:shadow-lg animate-fadeIn">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-soft-slate">
              <Target className="mr-1 h-3 w-3" />
              {sector}
            </Badge>
            <Badge variant="outline" className="bg-soft-gray">
              <ChartBar className="mr-1 h-3 w-3" />
              {stage}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
