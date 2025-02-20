
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Company } from "@/types/company";

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompanies = async () => {
    try {
      console.log('[useCompanies] Fetching companies...');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[useCompanies] Error fetching companies:', error);
        throw error;
      }

      console.log('[useCompanies] Fetched companies:', data);
      setCompanies(data || []);
    } catch (error) {
      console.error('[useCompanies] Error in fetchCompanies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch companies. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    isLoading,
    fetchCompanies,
  };
}
