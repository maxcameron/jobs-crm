
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Navigation = () => {
  const { session, supabase } = useAuth();

  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return false;
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: session.user.id,
        _role: 'admin'
      });
      if (error) return false;
      return data;
    },
    enabled: !!session?.user.id,
  });

  if (!session) return null;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-semibold text-lg">
          Jobs CRM
        </Link>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <NavLink 
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              Admin
            </NavLink>
          )}
          <NavLink 
            to="/onboarding" 
            className={({ isActive }) =>
              `${isActive ? '' : 'hover:bg-accent hover:text-accent-foreground'} inline-flex items-center justify-center rounded-md w-10 h-10`
            }
          >
            <Settings className="h-5 w-5" />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
