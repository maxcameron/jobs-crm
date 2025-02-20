
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { CompanySector, CompanyStage, CompanyLocation, OfficePreference } from "@/components/preferences/types";

export function useUserPreferences() {
  const [userSectors, setUserSectors] = useState<CompanySector[]>([]);
  const [userStages, setUserStages] = useState<CompanyStage[]>([]);
  const [userLocations, setUserLocations] = useState<CompanyLocation[]>([]);
  const [userOfficePreferences, setUserOfficePreferences] = useState<OfficePreference[]>([]);
  const { session } = useAuth();
  const { toast } = useToast();

  const fetchUserPreferences = async () => {
    if (!session?.user.id) return;

    try {
      const { data: preferences, error } = await supabase
        .from('user_tracking_preferences')
        .select('sectors, stages, locations, office_preferences')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        // If no record exists, create one
        if (error.code === 'PGRST116') {
          const { data: newPreferences, error: insertError } = await supabase
            .from('user_tracking_preferences')
            .insert([{
              user_id: session.user.id,
              sectors: [],
              stages: [],
              locations: [],
              office_preferences: [],
            }])
            .select('sectors, stages, locations, office_preferences')
            .single();

          if (insertError) {
            console.error('Error creating user preferences:', insertError);
            throw insertError;
          }

          setUserSectors(newPreferences.sectors || []);
          setUserStages(newPreferences.stages || []);
          setUserLocations(newPreferences.locations || []);
          setUserOfficePreferences(newPreferences.office_preferences || []);
          return;
        }
        console.error('Error fetching user preferences:', error);
        throw error;
      }

      setUserSectors(preferences.sectors || []);
      setUserStages(preferences.stages || []);
      setUserLocations(preferences.locations || []);
      setUserOfficePreferences(preferences.office_preferences || []);
    } catch (error) {
      console.error('Error fetching/creating user preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load user preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (session?.user.id) {
      console.log('[useUserPreferences] Fetching preferences for user:', session.user.id);
      fetchUserPreferences();
    }
  }, [session?.user.id]);

  return {
    userSectors,
    userStages,
    userLocations,
    userOfficePreferences,
    fetchUserPreferences,
  };
}
