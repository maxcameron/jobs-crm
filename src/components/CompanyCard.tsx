
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Target, ChartBar, Globe, MapPin, Calendar, DollarSign, Building2 } from "lucide-react";

interface CompanyCardProps {
  name: string;
  sector: string;
  subSector: string;
  fundingType: string;
  fundingDate: string;
  fundingAmount: string;
  websiteUrl: string;
  headquarterLocation: string;
  description: string;
}

export const CompanyCard = ({ 
  name, 
  sector, 
  subSector,
  fundingType,
  fundingDate,
  fundingAmount,
  websiteUrl,
  headquarterLocation,
  description 
}: CompanyCardProps) => {
  return (
    <Card className="group transition-all duration-300 hover:shadow-lg animate-fadeIn">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
            <a 
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
            >
              <Globe className="h-3 w-3" />
              {new URL(websiteUrl).hostname}
            </a>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant="outline" className="bg-primary/5 text-primary">
              <Target className="mr-1 h-3 w-3" />
              {sector}
            </Badge>
            <Badge variant="outline" className="bg-muted/50">
              <Building2 className="mr-1 h-3 w-3" />
              {subSector}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {headquarterLocation}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {fundingDate}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            ${fundingAmount}
          </div>
          <Badge variant="outline" className="bg-accent">
            <ChartBar className="mr-1 h-3 w-3" />
            {fundingType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
