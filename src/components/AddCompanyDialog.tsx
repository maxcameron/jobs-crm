
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

type CompanySector = Database["public"]["Enums"]["company_sector"];
type CompanyStage = Database["public"]["Enums"]["company_stage"];

interface AddCompanyForm {
  name: string;
  sector: CompanySector;
  subSector: string;
  fundingType: CompanyStage;
  fundingDate: string;
  fundingAmount: string;
  websiteUrl: string;
  headquarterLocation: string;
  description: string;
}

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCompanyDialog = ({ open, onOpenChange }: AddCompanyDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [formData, setFormData] = useState<AddCompanyForm>({
    name: "",
    sector: "Artificial Intelligence",
    subSector: "",
    fundingType: "Seed",
    fundingDate: "",
    fundingAmount: "",
    websiteUrl: "",
    headquarterLocation: "",
    description: "",
  });

  const { toast } = useToast();
  const { supabase } = useAuth();
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResearch = async () => {
    if (!formData.websiteUrl) {
      toast({
        title: "Error",
        description: "Please enter a website URL to research.",
        variant: "destructive",
      });
      return;
    }

    setIsResearching(true);

    try {
      const response = await supabase.functions.invoke('research-company', {
        body: { url: formData.websiteUrl }
      });

      if (response.error) throw new Error(response.error.message || 'Research failed');
      
      const data = response.data;

      setFormData(prev => ({
        ...prev,
        name: data.name || prev.name,
        sector: data.sector || prev.sector,
        subSector: data.subSector || prev.subSector,
        fundingType: data.fundingType || prev.fundingType,
        fundingDate: data.fundingDate || prev.fundingDate,
        fundingAmount: data.fundingAmount || prev.fundingAmount,
        headquarterLocation: data.headquarterLocation || prev.headquarterLocation,
        description: data.description || prev.description,
      }));

      toast({
        title: "Research Complete",
        description: "Company information has been filled automatically.",
      });
    } catch (error) {
      console.error('Research error:', error);
      toast({
        title: "Research Failed",
        description: error instanceof Error ? error.message : "Failed to research company.",
        variant: "destructive",
      });
    } finally {
      setIsResearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('companies')
        .insert([{
          name: formData.name,
          sector: formData.sector,
          sub_sector: formData.subSector,
          funding_type: formData.fundingType,
          funding_date: formData.fundingDate,
          funding_amount: formData.fundingAmount,
          website_url: formData.websiteUrl,
          headquarter_location: formData.headquarterLocation,
          description: formData.description,
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['adminCompanies'] });
      setFormData({
        name: "",
        sector: "Artificial Intelligence",
        subSector: "",
        fundingType: "Seed",
        fundingDate: "",
        fundingAmount: "",
        websiteUrl: "",
        headquarterLocation: "",
        description: "",
      });
      onOpenChange(false);

      toast({
        title: "Company Added",
        description: "The company has been successfully added to your tracker.",
      });
    } catch (error) {
      console.error('Error adding company:', error);
      toast({
        title: "Error",
        description: "Failed to add company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sectors: CompanySector[] = [
    "Marketing Technology",
    "Business & Productivity Software",
    "Procurement Tech",
    "Marketplace",
    "Fintech",
    "Logistics",
    "Artificial Intelligence",
    "PropTech",
    "SaaS",
    "Automotive Tech",
    "Energy Tech",
    "Construction Tech",
    "HealthTech",
    "Home Services Tech",
    "Communication Software",
    "Industrial Tech",
    "Medical Tech",
    "HR Tech",
    "Sales Tech",
    "Event Tech",
    "Legal Tech",
    "E-commerce",
    "Media & Information Services",
    "AdTech",
    "Travel Tech",
    "Data Infrastructure",
    "Recreation Tech",
    "InsurTech",
    "FoodTech",
    "AgTech",
    "Market Intelligence",
    "Manufacturing Tech",
    "Customer Experience Tech",
    "Recruitment Tech",
    "Retail Tech",
    "Professional Training Tech",
    "GovTech",
    "Sustainability Tech",
    "Childcare Tech",
    "Business Intelligence",
    "Entertainment Software",
    "EdTech",
    "Customer Support Tech",
    "Mobility Tech",
    "Nonprofit Tech",
    "Blockchain"
  ];

  const stages: CompanyStage[] = [
    "Seed",
    "Series A",
    "Series B",
    "Series C",
    "Series D",
    "Series E and above"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Company Website</Label>
            <div className="flex gap-2">
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />
              <Button 
                type="button" 
                onClick={handleResearch}
                disabled={isResearching}
              >
                {isResearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Researching...
                  </>
                ) : (
                  "Research"
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Acme Inc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <select
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subSector">Sub-Sector</Label>
              <Input
                id="subSector"
                name="subSector"
                value={formData.subSector}
                onChange={handleChange}
                placeholder="e.g., SMB, Enterprise"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fundingType">Funding Stage</Label>
              <select
                id="fundingType"
                name="fundingType"
                value={formData.fundingType}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fundingDate">Funding Date</Label>
              <Input
                id="fundingDate"
                name="fundingDate"
                value={formData.fundingDate}
                onChange={handleChange}
                placeholder="MM/YYYY"
                pattern="\d{2}/\d{4}"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fundingAmount">Funding Amount</Label>
              <Input
                id="fundingAmount"
                name="fundingAmount"
                value={formData.fundingAmount}
                onChange={handleChange}
                placeholder="e.g., 1,000,000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="headquarterLocation">Headquarters</Label>
              <Input
                id="headquarterLocation"
                name="headquarterLocation"
                value={formData.headquarterLocation}
                onChange={handleChange}
                placeholder="e.g., San Francisco"
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief company description"
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Company...
              </>
            ) : (
              "Add Company"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
