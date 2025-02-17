
import { useState, useEffect } from "react";
import { Company } from "@/types/company";

export function useCompanyFilters(
  companies: Company[],
  userSectors: string[],
  userStages: string[]
) {
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All");
  const [uniqueSectors, setUniqueSectors] = useState<string[]>([]);
  const [uniqueStages, setUniqueStages] = useState<string[]>([]);

  useEffect(() => {
    if (companies.length > 0 && userSectors.length > 0 && userStages.length > 0) {
      // Get companies that match user's selected sectors and stages
      const companiesInUserPreferences = companies.filter(company => 
        userSectors.includes(company.sector) && userStages.includes(company.funding_type)
      );

      // Only show sectors that are in user preferences
      const filteredSectors = Array.from(new Set(
        companiesInUserPreferences.map(company => company.sector)
      ));
      setUniqueSectors(filteredSectors);

      // Only show stages from companies in user's selected sectors and stages
      const filteredStages = Array.from(new Set(
        companiesInUserPreferences.map(company => company.funding_type)
      )).sort((a, b) => {
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
  }, [companies, userSectors, userStages]);

  return {
    selectedSector,
    setSelectedSector,
    selectedStage,
    setSelectedStage,
    uniqueSectors,
    uniqueStages,
  };
}
