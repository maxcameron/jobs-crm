
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddCompanyDialogProps {
  onAddCompany: (company: {
    name: string;
    sector: string;
    subSector: string;
    fundingType: string;
    fundingDate: string;
    fundingAmount: string;
    websiteUrl: string;
    headquarterLocation: string;
    description: string;
  }) => void;
}

export const AddCompanyDialog = ({ onAddCompany }: AddCompanyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    subSector: "",
    fundingType: "",
    fundingDate: "",
    fundingAmount: "",
    websiteUrl: "",
    headquarterLocation: "",
    description: "",
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all fields are filled
    if (Object.values(formData).some(value => !value)) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(formData.websiteUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
        variant: "destructive",
      });
      return;
    }

    // Validate date format (MM/YYYY)
    const dateRegex = /^(0[1-9]|1[0-2])\/20\d{2}$/;
    if (!dateRegex.test(formData.fundingDate)) {
      toast({
        title: "Invalid Date",
        description: "Please enter the date in MM/YYYY format (e.g., 02/2024).",
        variant: "destructive",
      });
      return;
    }

    onAddCompany(formData);
    setFormData({
      name: "",
      sector: "",
      subSector: "",
      fundingType: "",
      fundingDate: "",
      fundingAmount: "",
      websiteUrl: "",
      headquarterLocation: "",
      description: "",
    });
    setOpen(false);

    toast({
      title: "Company Added",
      description: "The company has been successfully added to your tracker.",
    });
  };

  const sectors = [
    "Fintech",
    "Marketplace",
    "Procurement & Supply Chain",
    "Sales Tech",
    "AI",
  ];

  const subSectors = [
    "SMB",
    "Insurance",
    "HR Tech",
    "Enterprise",
    "Consumer",
  ];

  const fundingTypes = [
    "Pre-Seed",
    "Seed",
    "Series A",
    "Series B",
    "Series C",
    "Venture",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Company Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Walmart"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Sector
              </label>
              <Select 
                value={formData.sector} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Sub-Sector
              </label>
              <Select 
                value={formData.subSector}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subSector: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-sector" />
                </SelectTrigger>
                <SelectContent>
                  {subSectors.map((subSector) => (
                    <SelectItem key={subSector} value={subSector}>
                      {subSector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Funding Type
              </label>
              <Select 
                value={formData.fundingType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, fundingType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select funding type" />
                </SelectTrigger>
                <SelectContent>
                  {fundingTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="fundingDate">
                Funding Date
              </label>
              <Input
                id="fundingDate"
                value={formData.fundingDate}
                onChange={(e) => setFormData(prev => ({ ...prev, fundingDate: e.target.value }))}
                placeholder="MM/YYYY (e.g., 02/2024)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="fundingAmount">
                Funding Amount (USD)
              </label>
              <Input
                id="fundingAmount"
                value={formData.fundingAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, fundingAmount: e.target.value }))}
                placeholder="e.g., 16,000,000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="websiteUrl">
                Website URL
              </label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                placeholder="e.g., https://google.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="headquarterLocation">
                Headquarter Location
              </label>
              <Input
                id="headquarterLocation"
                value={formData.headquarterLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, headquarterLocation: e.target.value }))}
                placeholder="e.g., San Francisco"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter company description"
              rows={3}
            />
          </div>
          
          <Button type="submit" className="w-full">
            Add Company
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
