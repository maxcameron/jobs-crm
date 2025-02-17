
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";

export function useAdminCheck() {
  const { supabase, session } = useAuth();

  return useQuery({
    queryKey: ['isAdmin', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: session?.user.id,
        _role: 'admin'
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });
}
