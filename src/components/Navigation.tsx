
import { Link, useLocation } from "react-router-dom";
import { Building2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "./AuthProvider";

export function Navigation() {
  const location = useLocation();
  const { session } = useAuth();
  
  if (!session) {
    return null;
  }
  
  return (
    <nav className="fixed left-0 top-0 z-30 h-screen w-[64px] border-r bg-background px-2 py-4">
      <div className="flex h-full flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link 
                  to="/" 
                  className={cn(
                    "flex items-center justify-center rounded-md p-2 hover:bg-accent",
                    location.pathname === "/" && "bg-accent"
                  )}
                >
                  <Building2 className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                Companies
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/preferences"
                  className={cn(
                    "flex items-center justify-center rounded-md p-2 hover:bg-accent",
                    location.pathname === "/preferences" && "bg-accent"
                  )}
                >
                  <Settings className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                Preferences
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </nav>
  );
}
