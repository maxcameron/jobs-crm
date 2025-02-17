
import { useState, useEffect } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import { Filters } from "@/components/Filters";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Plus } from "lucide-react";
import { AddCompanyDialog } from "@/components/AddCompanyDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

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
  id: string;
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
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [userSectors, setUserSectors] = useState<string[]>([]);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCompanies(), fetchUserPreferences()]);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (companies.length > 0 && userSectors.length > 0) {
      // Get companies that match user's selected sectors
      const companiesInUserSectors = companies.filter(company => 
        userSectors.includes(company.sector)
      );

      // Only show sectors that are in user preferences
      const filteredSectors = Array.from(new Set(
        companiesInUserSectors.map(company => company.sector)
      ));
      setUniqueSectors(filteredSectors);

      // Only show stages from companies in user's selected sectors
      const filteredStages = Array.from(new Set(
        companiesInUserSectors.map(company => company.funding_type)
      )).sort((a, b) => {
        // Custom sorting for funding stages
        const stageOrder = {
          'Seed': 1,
          'Series A': 2,
          'Series B': 3,
          'Series C': 4,
          'Series D': 5,
          'Series E and above': 6
        };
        return (stageOrder[a as keyof typeof stageOrder] || 0) - (stageOrder[b as keyof typeof stageOrder] || 0);
      });
      setUniqueStages(filteredStages);
    }
  }, [companies, userSectors]);

  const fetchUserPreferences = async () => {
    if (!session?.user.id) return;

    try {
      const { data: preferences, error } = await supabase
        .from('user_tracking_preferences')
        .select('sectors')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;

      if (preferences) {
        setUserSectors(preferences.sectors);
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

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

  const filteredCompanies = companies.filter((company) => {
    const matchesSector = selectedSector === "All" || company.sector === selectedSector;
    const matchesStage = selectedStage === "All" || company.funding_type === selectedStage;
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isInUserSectors = userSectors.includes(company.sector);
    return matchesSector && matchesStage && matchesSearch && isInUserSectors;
  });

  return (
    <div className="min-h-screen bg-background pl-16">
      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Companies</h1>
            <p className="text-muted-foreground">
              Track and filter companies by sector and funding stage.
            </p>
          </div>
          <Button onClick={() => setIsAddCompanyOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>

        <div className="space-y-6">
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
      
      <AddCompanyDialog 
        open={isAddCompanyOpen}
        onOpenChange={setIsAddCompanyOpen}
      />
    </div>
  );
};

export default Index;
