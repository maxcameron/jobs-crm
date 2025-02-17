
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";

export function useCompaniesAdmin() {
  const { supabase } = useAuth();

  return useQuery({
    queryKey: ['adminCompanies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}
