
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TagFilter {
  value: string;
  count: number;
}

export function useCompanyTags() {
  return useQuery({
    queryKey: ["company-tags"],
    queryFn: async (): Promise<TagFilter[]> => {
      const { data: companies, error } = await supabase
        .from("companies")
        .select("tags");

      if (error) throw error;

      // Create a map to count tag occurrences
      const tagCountMap = new Map<string, number>();
      
      companies.forEach(company => {
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
        .sort((a, b) => b.count - a.count); // Sort by count descending
    }
  });
}
