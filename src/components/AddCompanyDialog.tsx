import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { CompanyLocation, CompanySector } from "./preferences/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const COMPANY_LOCATIONS: CompanyLocation[] = [
  "New York",
  "San Francisco",
  "London",
  "Berlin",
  "Paris",
  "Toronto",
  "Amsterdam",
  "Singapore",
  "Sydney",
  "Tel Aviv",
  "Boston",
  "Austin",
  "Seattle",
  "Chicago",
  "Los Angeles",
  "Miami",
  "Vancouver",
  "Dublin",
  "Stockholm",
  "Tokyo"
];

const COMPANY_SECTORS: CompanySector[] = [
  "Marketing Technology",
  "Business and Productivity Software",
  "Procurement Tech",
  "Marketplace",
  "Fintech",
  "Logistics",
  "AI",
  "PropTech",
  "SaaS",
  "Automotive",
  "Energy",
  "Construction Technology",
  "HealthTech",
  "Home Services",
  "Communication Software",
  "Industrial Technology",
  "Medical Technology",
  "HR Tech",
  "Sales Tech",
  "Event Technology",
  "Legal Tech",
  "E-Commerce",
  "Media and Information Services",
  "Advertising Technology",
  "Travel Technology",
  "Data Infrastructure",
  "Recreation Tech",
  "InsurTech",
  "FoodTech",
  "AgTech",
  "Market Intelligence",
  "Manufacturing",
  "Customer Experience Technology",
  "Recruitment Technology",
  "Retail Technology",
  "Professional Training and Coaching",
  "Government Technology",
  "Sustainability Technology",
  "Childcare Services",
  "Business Intelligence",
  "Entertainment Software",
  "EdTech",
  "Customer Support Technology",
  "Mobility",
  "Nonprofit Tech",
  "Blockchain"
];

interface AddCompanyForm {
  name: string;
  description: string;
  sector: CompanySector;
  location: CompanyLocation;
}

export function AddCompanyDialog() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<AddCompanyForm>();

  const onSubmit = async (data: AddCompanyForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from('companies').insert(data);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Company added successfully!",
      });
      form.reset();
    } catch (error) {
      console.error("Error adding company:", error);
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
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Company</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMPANY_SECTORS.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMPANY_LOCATIONS.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Company
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
