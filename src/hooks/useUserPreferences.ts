
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export function useUserPreferences() {
  const [userSectors, setUserSectors] = useState<string[]>([]);
  const [userStages, setUserStages] = useState<string[]>([]);
  const { session } = useAuth();
  const { toast } = useToast();

  const fetchUserPreferences = async () => {
    if (!session?.user.id) return;

    try {
      const { data: preferences, error } = await supabase
        .from('user_tracking_preferences')
        .select('sectors, stages')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (!preferences) {
        // Create a new preferences record if none exists
        const { data: newPreferences, error: insertError } = await supabase
          .from('user_tracking_preferences')
          .insert([{
            user_id: session.user.id,
            sectors: [],
            stages: [],
            locations: [],
            office_preferences: [],
          }])
          .select('sectors, stages')
          .single();

        if (insertError) throw insertError;

        setUserSectors(newPreferences.sectors || []);
        setUserStages(newPreferences.stages || []);
      } else {
        setUserSectors(preferences.sectors || []);
        setUserStages(preferences.stages || []);
      }
    } catch (error) {
      console.error('Error fetching/creating user preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load user preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    userSectors,
    userStages,
    fetchUserPreferences,
  };
}
