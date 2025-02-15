
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
}

interface JobPosting {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
}

interface Company {
  id: string;
  name: string;
  sector: string;
  sub_sector: string;
  funding_type: string;
  funding_date: string;
  funding_amount: string;
  website_url: string;
  headquarter_location: string;
  description: string;
}

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', id)
          .single();

        if (companyError) throw companyError;
        setCompany(companyData);

        // Fetch contacts
        const { data: contactsData, error: contactsError } = await supabase
          .from('company_contacts')
          .select('*')
          .eq('company_id', id);

        if (contactsError) throw contactsError;
        setContacts(contactsData);

        // Fetch job postings
        const { data: jobsData, error: jobsError } = await supabase
          .from('job_postings')
          .select('*')
          .eq('company_id', id);

        if (jobsError) throw jobsError;
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching company data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch company data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCompanyData();
    }
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Company not found.</p>
          <Button asChild className="mt-4">
            <Link to="/">Back to Companies</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{company.name}</h1>
            <p className="text-muted-foreground">{company.sector} • {company.sub_sector}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Building2 className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Company Overview</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{company.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{company.headquarter_location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <a 
                      href={company.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {new URL(company.website_url).hostname}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Latest Funding</p>
                    <p className="font-medium">${company.funding_amount} ({company.funding_type})</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Funding Date</p>
                    <p className="font-medium">{company.funding_date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Briefcase className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Open Positions</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div key={job.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.location} • {job.type}</p>
                      <p className="mt-2 text-sm">{job.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No open positions at the moment.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Users className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Key Contacts</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <div key={contact.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.title}</p>
                      <a 
                        href={`mailto:${contact.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No contacts available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
