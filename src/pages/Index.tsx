
import { useState } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import { Filters } from "@/components/Filters";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AddCompanyDialog } from "@/components/AddCompanyDialog";

interface Company {
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

const initialCompanies = [
  {
    name: "interviewing.io",
    sector: "AI",
    subSector: "HR Tech",
    fundingType: "Series A",
    fundingDate: "02/2024",
    fundingAmount: "16,000,000",
    websiteUrl: "https://interviewing.io",
    headquarterLocation: "San Francisco",
    description: "interviewing.io is a platform that helps engineers practice technical interviews anonymously and connect with top tech companies for real job opportunities.",
  },
];

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddCompany = (newCompany: Company) => {
    setCompanies((prev) => [...prev, newCompany]);
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSector = selectedSector === "All" || company.sector === selectedSector;
    const matchesStage = selectedStage === "All" || company.fundingType === selectedStage;
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesStage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Company Tracker</h1>
            <p className="text-muted-foreground">
              Track and filter companies by sector and funding stage.
            </p>
          </div>
          <AddCompanyDialog onAddCompany={handleAddCompany} />
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <Filters
              selectedSector={selectedSector}
              selectedStage={selectedStage}
              onSectorChange={setSelectedSector}
              onStageChange={setSelectedStage}
            />
          </aside>
          
          <main className="md:col-span-3">
            <div className="grid gap-4">
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.name} {...company} />
              ))}
              {filteredCompanies.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No companies found matching your criteria.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
