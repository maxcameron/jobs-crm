
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanySector } from '@/components/preferences/types';

export function useSectors() {
  const [sectors, setSectors] = useState<CompanySector[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        console.log('[useSectors] Fetching sectors...');
        const { data, error } = await supabase
          .from('companies')
          .select('sector');

        if (error) {
          console.error('[useSectors] Error fetching sectors:', error);
          throw error;
        }

        // Get unique sectors
        const uniqueSectors = Array.from(new Set(data.map(item => item.sector))) as CompanySector[];
        console.log('[useSectors] Fetched unique sectors:', uniqueSectors);
        setSectors(uniqueSectors.sort());
      } catch (error) {
        console.error('[useSectors] Error in fetchSectors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSectors();
  }, []);

  return { sectors, isLoading };
}
