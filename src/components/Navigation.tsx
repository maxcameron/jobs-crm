
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { Settings, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import SideNavigation from "./SideNavigation";

const Navigation = () => {
  const { session, supabase, handleSignOut } = useAuth();
  const { toast } = useToast();

  console.log("Navigation render - session:", session?.user?.email);

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

  const onSignOut = async () => {
    try {
      await handleSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-semibold text-lg">
              Jobs CRM
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <NavLink 
                to="/"
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
                }
              >
                Dashboard
              </NavLink>
              {isAdmin && (
                <NavLink 
                  to="/admin"
                  className={({ isActive }) =>
                    `text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
                  }
                >
                  Admin
                </NavLink>
              )}
            </div>
          </div>
          {session && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:block">
                {session.user.email}
              </span>
              <NavLink 
                to="/preferences" 
                className={({ isActive }) =>
                  `${isActive ? '' : 'hover:bg-accent hover:text-accent-foreground'} inline-flex items-center justify-center rounded-md w-10 h-10`
                }
              >
                <Settings className="h-5 w-5" />
              </NavLink>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onSignOut}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </nav>
      {session && <SideNavigation />}
    </>
  );
};

export default Navigation;
