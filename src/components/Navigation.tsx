
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { Settings, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const { session, supabase } = useAuth();
  const { toast } = useToast();

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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!session) return null;

  return (
    <nav className="border-b">
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
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:block">
            {session.user.email}
          </span>
          <NavLink 
            to="/onboarding" 
            className={({ isActive }) =>
              `${isActive ? '' : 'hover:bg-accent hover:text-accent-foreground'} inline-flex items-center justify-center rounded-md w-10 h-10`
            }
          >
            <Settings className="h-5 w-5" />
          </NavLink>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSignOut}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
