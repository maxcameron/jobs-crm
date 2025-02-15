
import { useState, useEffect } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import { Filters } from "@/components/Filters";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { AddCompanyDialog } from "@/components/AddCompanyDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: string;
  created_at: string;
  name: string;
  sector: string;
  sub_sector: string;
  funding_type: string;
  funding_date: string;
  funding_amount: string;
  website_url: string;
  headquarter_location: string;
  description: string;
}

interface CompanyDisplay {
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

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [uniqueSectors, setUniqueSectors] = useState<string[]>([]);
  const [uniqueStages, setUniqueStages] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (companies.length > 0) {
      // Extract unique sectors and stages from companies
      const sectors = Array.from(new Set(companies.map(company => company.sector)));
      const stages = Array.from(new Set(companies.map(company => company.funding_type)));
      setUniqueSectors(sectors);
      setUniqueStages(stages);
    }
  }, [companies]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch companies. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCompany = (newCompany: CompanyDisplay) => {
    // Map the display names to database column names
    const dbCompany: Partial<Company> = {
      name: newCompany.name,
      sector: newCompany.sector,
      sub_sector: newCompany.subSector,
      funding_type: newCompany.fundingType,
      funding_date: newCompany.fundingDate,
      funding_amount: newCompany.fundingAmount,
      website_url: newCompany.websiteUrl,
      headquarter_location: newCompany.headquarterLocation,
      description: newCompany.description,
    };
    setCompanies((prev) => [{ ...dbCompany, id: '', created_at: new Date().toISOString() } as Company, ...prev]);
  };

  const mapToDisplayCompany = (company: Company): CompanyDisplay => ({
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

  const filteredCompanies = companies.filter((company) => {
    const matchesSector = selectedSector === "All" || company.sector === selectedSector;
    const matchesStage = selectedStage === "All" || company.funding_type === selectedStage;
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
              availableSectors={uniqueSectors}
              availableStages={uniqueStages}
            />
          </aside>
          
          <main className="md:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
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
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
