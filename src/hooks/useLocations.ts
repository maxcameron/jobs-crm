
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanyLocation } from '@/components/preferences/types';

export function useLocations() {
  const [locations, setLocations] = useState<CompanyLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('headquarter_location')
          .not('headquarter_location', 'is', null);

        if (error) throw error;

        // Get unique locations
        const uniqueLocations = Array.from(new Set(data.map(item => item.headquarter_location))) as CompanyLocation[];
        setLocations(uniqueLocations.sort());
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { locations, isLoading };
}
