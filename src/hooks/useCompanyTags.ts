
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TagFilter {
  value: string;
  count: number;
}

export interface UseCompanyTagsProps {
  selectedSector: string;
  selectedStage: string;
  searchQuery: string;
  userSectors: string[];
  userStages: string[];
}

export function useCompanyTags({ 
  selectedSector, 
  selectedStage, 
  searchQuery, 
  userSectors, 
  userStages 
}: UseCompanyTagsProps) {
  return useQuery({
    queryKey: ["company-tags", selectedSector, selectedStage, searchQuery, userSectors, userStages],
    queryFn: async (): Promise<TagFilter[]> => {
      const { data: companies, error } = await supabase
        .from("companies")
        .select("*");

      if (error) throw error;

      // Filter companies based on all criteria
      const filteredCompanies = companies.filter(company => {
        const matchesSector = selectedSector === "All" || company.sector === selectedSector;
        const matchesStage = selectedStage === "All" || company.funding_type === selectedStage;
        const matchesSearch = !searchQuery || 
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.description.toLowerCase().includes(searchQuery.toLowerCase());
        const isInUserSectors = userSectors.includes(company.sector);
        const isInUserStages = userStages.includes(company.funding_type);
        
        return matchesSector && matchesStage && matchesSearch && isInUserSectors && isInUserStages;
      });

      // Create a map to count tag occurrences only from filtered companies
      const tagCountMap = new Map<string, number>();
      
      filteredCompanies.forEach(company => {
        if (company.tags) {
          company.tags
            .filter(tag => tag && tag.trim() !== '')
            .forEach((tag: string) => {
              tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
            });
        }
      });

      // Convert map to array of TagFilter objects
      return Array.from(tagCountMap.entries())
        .map(([tag, count]) => ({
          value: tag,
          count
        }))
        .sort((a, b) => b.count - a.count);
    }
  });
}
