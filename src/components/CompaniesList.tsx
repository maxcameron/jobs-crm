
import { Loader2 } from "lucide-react";
import { Company, CompanyDisplay } from "@/types/company";
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
import { formatWebsiteUrl, getDisplayUrl } from "@/lib/url-utils";

interface CompaniesListProps {
  companies: Company[];
  isLoading: boolean;
  userSectors: string[];
  userStages: string[];
  selectedSector: string;
  selectedStage: string;
  selectedTag: string | null;
  searchQuery: string;
}

const mapToDisplayCompany = (company: Company): CompanyDisplay & { id: string } => ({
  id: company.id,
  name: company.name,
  sector: company.sector,
  subSector: company.sub_sector,
  fundingType: company.funding_type,
  fundingDate: company.funding_date,
  fundingAmount: company.funding_amount || '0',
  websiteUrl: company.website_url,
  headquarterLocation: company.headquarter_location,
  description: company.description,
  tags: company.tags || [],
});

export function CompaniesList({ 
  companies, 
  isLoading, 
  userSectors, 
  userStages, 
  selectedSector, 
  selectedStage,
  selectedTag,
  searchQuery 
}: CompaniesListProps) {
  const formatCurrency = (amount: string | number | null | undefined) => {
    if (!amount) return '$0';
    const cleanAmount = typeof amount === 'string' ? 
      amount.replace(/[$,]/g, '') : 
      amount.toString();
    
    const numAmount = parseFloat(cleanAmount);
    if (isNaN(numAmount)) return '$0';
    return `$${numAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSector = selectedSector === "All" || company.sector === selectedSector;
    const matchesStage = selectedStage === "All" || company.funding_type === selectedStage;
    const matchesTag = !selectedTag || (company.tags && company.tags.includes(selectedTag));
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isInUserSectors = userSectors.includes(company.sector);
    const isInUserStages = userStages.includes(company.funding_type);
    return matchesSector && matchesStage && matchesTag && matchesSearch && isInUserSectors && isInUserStages;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
            <TableHead className="max-w-xl">Description</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompanies.map((company) => {
            const displayCompany = mapToDisplayCompany(company);
            const websiteUrl = formatWebsiteUrl(displayCompany.websiteUrl);
            return (
              <TableRow key={company.id}>
                <TableCell>
                  <Link 
                    to={`/company/${company.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {displayCompany.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-primary">
                    {displayCompany.sector}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {displayCompany.subSector}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {displayCompany.fundingType}
                  </div>
                </TableCell>
                <TableCell>{displayCompany.fundingDate}</TableCell>
                <TableCell>{formatCurrency(displayCompany.fundingAmount)}</TableCell>
                <TableCell>
                  {displayCompany.websiteUrl && (
                    <a 
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {getDisplayUrl(displayCompany.websiteUrl)}
                    </a>
                  )}
                </TableCell>
                <TableCell>{displayCompany.headquarterLocation}</TableCell>
                <TableCell className="max-w-xl whitespace-normal">
                  {displayCompany.description}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {displayCompany.tags?.map((tag, index) => (
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
            );
          })}
        </TableBody>
      </Table>
      {filteredCompanies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No companies found matching your criteria.
        </div>
      )}
    </div>
  );
}
