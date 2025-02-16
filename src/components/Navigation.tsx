
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "./AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const { data: preferences } = useQuery({
    queryKey: ['preferences', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data, error } = await supabase
        .from('user_tracking_preferences')
        .select('has_completed_onboarding')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });
  
  if (!session) {
    return null;
  }

  const isOnboarding = location.pathname === '/onboarding';
  const onboardingComplete = preferences?.has_completed_onboarding;
  
  return (
    <nav className="fixed left-0 top-0 z-[100] h-screen w-[64px] border-r bg-background px-2 py-4">
      <div className="flex h-full flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate("/")}
                  className={cn(
                    "flex items-center justify-center rounded-md p-2 hover:bg-accent",
                    location.pathname === "/" && "bg-accent"
                  )}
                >
                  <Building2 className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10} className="z-[110]">
                Companies
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate("/preferences")}
                  className={cn(
                    "flex items-center justify-center rounded-md p-2 hover:bg-accent",
                    location.pathname === "/preferences" && "bg-accent"
                  )}
                >
                  <Target className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10} className="z-[110]">
                Target Profile
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </nav>
  );
}
