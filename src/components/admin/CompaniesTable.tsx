
import { Company } from "@/types/company";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface CompaniesTableProps {
  companies: Company[] | null;
  isLoading: boolean;
}

export function CompaniesTable({ companies, isLoading }: CompaniesTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead>Sub-Sector</TableHead>
            <TableHead>Funding Type</TableHead>
            <TableHead>Funding Date</TableHead>
            <TableHead>Funding Amount</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies?.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <Link 
                  to={`/company/${company.id}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {company.name}
                </Link>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium text-primary">
                  {company.sector}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {company.sub_sector}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {company.funding_type}
                </div>
              </TableCell>
              <TableCell>{company.funding_date}</TableCell>
              <TableCell>{company.funding_amount}</TableCell>
              <TableCell>
                <Link 
                  to={company.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {new URL(company.website_url).hostname}
                </Link>
              </TableCell>
              <TableCell>{company.headquarter_location}</TableCell>
              <TableCell className="max-w-md truncate">
                {company.description}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {company.tags?.map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
