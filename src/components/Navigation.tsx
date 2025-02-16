
import { Link, useLocation } from "react-router-dom";
import { Building2, Settings } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center font-semibold">
          <Building2 className="mr-2 h-5 w-5" />
          Company Tracker
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          <Link 
            to="/" 
            className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${
              location.pathname === "/" ? "bg-accent" : ""
            }`}
          >
            Companies
          </Link>
          <Link
            to="/#preferences"
            className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${
              location.hash === "#preferences" ? "bg-accent" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              const tabs = document.querySelector('[role="tablist"]');
              if (tabs) {
                const preferencesTab = tabs.querySelector('[value="preferences"]') as HTMLButtonElement;
                if (preferencesTab) {
                  preferencesTab.click();
                }
              }
              window.history.pushState(null, '', '/#preferences');
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </Link>
        </div>
      </div>
    </nav>
  );
}
