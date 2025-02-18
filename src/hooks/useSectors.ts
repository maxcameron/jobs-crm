
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanySector } from '@/components/preferences/types';

export function useSectors() {
  const [sectors, setSectors] = useState<CompanySector[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('sector')
          .not('sector', 'is', null);

        if (error) throw error;

        // Get unique sectors
        const uniqueSectors = Array.from(new Set(data.map(item => item.sector))) as CompanySector[];
        setSectors(uniqueSectors.sort());
      } catch (error) {
        console.error('Error fetching sectors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSectors();
  }, []);

  return { sectors, isLoading };
}
