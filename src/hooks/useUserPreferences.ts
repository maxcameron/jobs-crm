
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export function useUserPreferences() {
  const [userSectors, setUserSectors] = useState<string[]>([]);
  const [userStages, setUserStages] = useState<string[]>([]);
  const { session } = useAuth();

  const fetchUserPreferences = async () => {
    if (!session?.user.id) return;

    try {
      const { data: preferences, error } = await supabase
        .from('user_tracking_preferences')
        .select('sectors, stages')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;

      if (preferences) {
        setUserSectors(preferences.sectors);
        setUserStages(preferences.stages);
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  return {
    userSectors,
    userStages,
    fetchUserPreferences,
  };
}
