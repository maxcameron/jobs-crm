
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { AddCompanyDialog } from "@/components/AddCompanyDialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { CompaniesTable } from "@/components/admin/CompaniesTable";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useCompaniesAdmin } from "@/hooks/useCompaniesAdmin";

const AdminDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  const { data: isAdmin, isLoading: isCheckingAdmin } = useAdminCheck();
  const { data: companies, isLoading: isLoadingCompanies } = useCompaniesAdmin();

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

      <CompaniesTable 
        companies={companies} 
        isLoading={isLoadingCompanies} 
      />

      <AddCompanyDialog 
        open={isAddCompanyOpen}
        onOpenChange={setIsAddCompanyOpen}
      />
    </div>
  );
};

export default AdminDashboard;
