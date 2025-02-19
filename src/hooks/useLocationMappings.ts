
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanyLocation } from '@/components/preferences/types';

interface LocationMapping {
  short_form: CompanyLocation;
  full_form: string;
}

export function useLocationMappings() {
  const [mappings, setMappings] = useState<Map<CompanyLocation, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const { data, error } = await supabase
          .from('location_mappings')
          .select('short_form, full_form');

        if (error) throw error;

        const newMappings = new Map<CompanyLocation, string>();
        data.forEach((mapping: LocationMapping) => {
          newMappings.set(mapping.short_form, mapping.full_form);
        });
        setMappings(newMappings);
      } catch (error) {
        console.error('Error fetching location mappings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMappings();
  }, []);

  return { mappings, isLoading };
}
