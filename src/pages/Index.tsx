
import { useState } from "react";
import { Filters } from "@/components/Filters";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { AddCompanyDialog } from "@/components/AddCompanyDialog";
import { Button } from "@/components/ui/button";
import { CompaniesList } from "@/components/CompaniesList";
import { useCompanies } from "@/hooks/useCompanies";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useCompanyFilters } from "@/hooks/useCompanyFilters";
import { useEffect } from "react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  
  const { companies, isLoading, fetchCompanies } = useCompanies();
  const { userSectors, userStages, fetchUserPreferences } = useUserPreferences();
  const { 
    selectedSector,
    setSelectedSector,
    selectedStage,
    setSelectedStage,
    uniqueSectors,
    uniqueStages,
  } = useCompanyFilters(companies, userSectors, userStages);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCompanies(), fetchUserPreferences()]);
    };
    loadData();
  }, []);

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
              <CompaniesList
                companies={companies}
                isLoading={isLoading}
                userSectors={userSectors}
                userStages={userStages}
                selectedSector={selectedSector}
                selectedStage={selectedStage}
                searchQuery={searchQuery}
              />
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
