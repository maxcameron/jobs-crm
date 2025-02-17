
export interface Company {
  id: string;
  created_at: string;
  name: string;
  sector: string;
  sub_sector: string;
  funding_type: string;
  funding_date: string;
  funding_amount: string;
  website_url: string;
  headquarter_location: string;
  description: string;
  tags: string[];
}

export interface CompanyDisplay {
  id: string;
  name: string;
  sector: string;
  subSector: string;
  fundingType: string;
  fundingDate: string;
  fundingAmount: string;
  websiteUrl: string;
  headquarterLocation: string;
  description: string;
  tags: string[];
}
