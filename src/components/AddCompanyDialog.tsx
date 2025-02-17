
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCompanyDialog = ({ open, onOpenChange }: AddCompanyDialogProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { supabase } = useAuth();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL format
    try {
      new URL(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('research-company', {
        body: { url }
      });

      if (error) throw error;

      // Add company to the database with correct column names
      const { error: insertError } = await supabase
        .from('companies')
        .insert([{
          name: data.name,
          sector: data.sector,
          sub_sector: data.subSector,
          funding_type: data.fundingType,
          funding_date: data.fundingDate,
          funding_amount: data.fundingAmount,
          website_url: data.websiteUrl,
          headquarter_location: data.headquarterLocation,
          description: data.description
        }]);

      if (insertError) throw insertError;

      queryClient.invalidateQueries({ queryKey: ['adminCompanies'] });
      setUrl("");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="url">
              Company Website URL
            </label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://example.com"
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Researching Company...
              </>
            ) : (
              'Add Company'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
