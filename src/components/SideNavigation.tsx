
import { NavLink } from "react-router-dom";
import { Building2, Settings } from "lucide-react";

const SideNavigation = () => {
  return (
    <nav className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 border-r bg-background flex flex-col items-center py-4 space-y-4">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `p-2 rounded-md hover:bg-accent ${isActive ? 'bg-accent' : ''}`
        }
        title="Companies"
      >
        <Building2 className="w-6 h-6" />
      </NavLink>
      <NavLink
        to="/onboarding"
        className={({ isActive }) =>
          `p-2 rounded-md hover:bg-accent ${isActive ? 'bg-accent' : ''}`
        }
        title="Preferences"
      >
        <Settings className="w-6 h-6" />
      </NavLink>
    </nav>
  );
};

export default SideNavigation;
