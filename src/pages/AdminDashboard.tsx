
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { AddCompanyDialog } from "@/components/AddCompanyDialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const { supabase, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['isAdmin', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: session?.user.id,
        _role: 'admin'
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  const { data: companies, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['adminCompanies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, isCheckingAdmin, navigate, toast]);

  if (isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Company Management</h1>
        <Button onClick={() => setIsAddCompanyOpen(true)}>
          Add Company
        </Button>
      </div>

      {isLoadingCompanies ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Funding Type</TableHead>
                <TableHead>Funding Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies?.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.sector}</TableCell>
                  <TableCell>{company.headquarter_location}</TableCell>
                  <TableCell>{company.funding_type}</TableCell>
                  <TableCell>{company.funding_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddCompanyDialog 
        open={isAddCompanyOpen}
        onOpenChange={setIsAddCompanyOpen}
      />
    </div>
  );
};

export default AdminDashboard;
