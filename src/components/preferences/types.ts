
import type { Database } from "@/integrations/supabase/types";

export type CompanyStage = Database["public"]["Enums"]["company_stage"];
export type CompanySector = Database["public"]["Enums"]["company_sector"];
export type CompanyLocation = Database["public"]["Enums"]["company_location"];
export type OfficePreference = Database["public"]["Enums"]["office_preference"];

export interface TrackingPreferences {
  stages: CompanyStage[];
  sectors: CompanySector[];
  locations: CompanyLocation[];
  office_preferences: OfficePreference[];
}

export const COMPANY_STAGES: CompanyStage[] = [
  "Seed", "Series A", "Series B", "Series C", "Series D", "Series E and above"
];

export const COMPANY_SECTORS: CompanySector[] = [
  "Artificial Intelligence (AI)",
  "Fintech",
  "HealthTech",
  "E-commerce & RetailTech",
  "Sales Tech & RevOps",
  "HR Tech & WorkTech",
  "PropTech (Real Estate Tech)",
  "LegalTech",
  "EdTech",
  "Cybersecurity",
  "Logistics & Supply Chain Tech",
  "Developer Tools & Web Infrastructure",
  "SaaS & Enterprise Software",
  "Marketing Tech (MarTech)",
  "InsurTech",
  "GovTech",
  "Marketplace Platforms",
  "Construction Tech & Fintech",
  "Mobility & Transportation Tech",
  "CleanTech & ClimateTech"
];

export const OFFICE_PREFERENCES: OfficePreference[] = ["Full-time Office", "Hybrid", "Remote"];
