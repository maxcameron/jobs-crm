
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
import { useAdminCheck } from "@/hooks/useAdminCheck";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const { companies, isLoading, fetchCompanies } = useCompanies();
  const { userSectors, userStages, fetchUserPreferences } = useUserPreferences();
  const { data: isAdmin } = useAdminCheck();
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
          {isAdmin && (
            <Button onClick={() => setIsAddCompanyOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Company
            </Button>
          )}
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

          <Filters
            selectedSector={selectedSector}
            selectedStage={selectedStage}
            selectedTag={selectedTag}
            searchQuery={searchQuery}
            userSectors={userSectors}
            userStages={userStages}
            onSectorChange={setSelectedSector}
            onStageChange={setSelectedStage}
            onTagChange={setSelectedTag}
            availableSectors={uniqueSectors}
            availableStages={uniqueStages}
          />
          
          <CompaniesList
            companies={companies}
            isLoading={isLoading}
            userSectors={userSectors}
            userStages={userStages}
            selectedSector={selectedSector}
            selectedStage={selectedStage}
            selectedTag={selectedTag}
            searchQuery={searchQuery}
          />
        </div>
      </div>
      
      {isAdmin && (
        <AddCompanyDialog 
          open={isAddCompanyOpen}
          onOpenChange={setIsAddCompanyOpen}
        />
      )}
    </div>
  );
};

export default Index;
