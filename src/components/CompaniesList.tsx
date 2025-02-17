
import { CompanyCard } from "@/components/CompanyCard";
import { Loader2 } from "lucide-react";
import { Company, CompanyDisplay } from "@/types/company";

interface CompaniesListProps {
  companies: Company[];
  isLoading: boolean;
  userSectors: string[];
  userStages: string[];
  selectedSector: string;
  selectedStage: string;
  searchQuery: string;
}

const mapToDisplayCompany = (company: Company): CompanyDisplay & { id: string } => ({
  id: company.id,
  name: company.name,
  sector: company.sector,
  subSector: company.sub_sector,
  fundingType: company.funding_type,
  fundingDate: company.funding_date,
  fundingAmount: company.funding_amount,
  websiteUrl: company.website_url,
  headquarterLocation: company.headquarter_location,
  description: company.description,
});

export function CompaniesList({ 
  companies, 
  isLoading, 
  userSectors, 
  userStages, 
  selectedSector, 
  selectedStage, 
  searchQuery 
}: CompaniesListProps) {
  const filteredCompanies = companies.filter((company) => {
    const matchesSector = selectedSector === "All" || company.sector === selectedSector;
    const matchesStage = selectedStage === "All" || company.funding_type === selectedStage;
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isInUserSectors = userSectors.includes(company.sector);
    const isInUserStages = userStages.includes(company.funding_type);
    return matchesSector && matchesStage && matchesSearch && isInUserSectors && isInUserStages;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {filteredCompanies.map((company) => (
        <CompanyCard key={company.id} {...mapToDisplayCompany(company)} />
      ))}
      {filteredCompanies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No companies found matching your criteria.
        </div>
      )}
    </div>
  );
}
