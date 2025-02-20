
export type CompanyStage =
  | "Pre-Seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C"
  | "Series D"
  | "Venture";

export type CompanySector =
  | "Advertising Technology"
  | "Aerospace and Defense"
  | "AgTech"
  | "AI"
  | "Automotive"
  | "Blockchain"
  | "Business and Productivity Software"
  | "Business Intelligence"
  | "Childcare Services"
  | "Communication Software"
  | "Construction Technology"
  | "Customer Experience Technology"
  | "Customer Support Technology"
  | "Cyber Security"
  | "Data Infrastructure"
  | "Developer Tools"
  | "E-Commerce"
  | "EdTech"
  | "Energy"
  | "Entertainment Software"
  | "Event Technology"
  | "Fintech"
  | "FoodTech"
  | "Government Technology"
  | "HealthTech"
  | "Home Services"
  | "HR Tech"
  | "Industrial Technology"
  | "InsurTech"
  | "Legal Tech"
  | "Logistics"
  | "Manufacturing"
  | "Market Intelligence"
  | "Marketing Technology"
  | "Marketplace"
  | "Media and Information Services"
  | "Medical Technology"
  | "Mobility"
  | "Nonprofit Tech"
  | "Procurement Tech"
  | "Professional Training and Coaching"
  | "PropTech"
  | "Recruitment Technology"
  | "Retail Technology"
  | "SaaS"
  | "Sales Tech"
  | "Sustainability Technology"
  | "Travel Technology"
  | "Climate Technology";

export type CompanyLocation =
  | "Abu Dhabi"
  | "Amsterdam"
  | "Arlington"
  | "Atlanta"
  | "Austin"
  | "Bend"
  | "Berlin"
  | "Berwyn"
  | "Boston"
  | "Brooklyn"
  | "Brookline"
  | "Campbell"
  | "Canton"
  | "Charlotte"
  | "Chicago"
  | "Columbus"
  | "Denver"
  | "Des Moines"
  | "Detroit"
  | "Distributed"
  | "Dublin"
  | "Fort Collins"
  | "Foster City"
  | "George Town"
  | "Greenwood Village"
  | "Holmdel"
  | "Irvine"
  | "Jersey City"
  | "Kansas City"
  | "Karlsruhe"
  | "Lehi"
  | "Lewes"
  | "London"
  | "Los Altos"
  | "Los Angeles"
  | "Medellín"
  | "Menlo Park"
  | "Miami"
  | "Middletown"
  | "Munich"
  | "Newton"
  | "New York"
  | "North Miami Beach"
  | "Oakland"
  | "Omaha"
  | "Or Yehuda"
  | "Palo Alto"
  | "Paris"
  | "Phoenix"
  | "Portland"
  | "Raleigh"
  | "Redmond"
  | "Redwood City"
  | "Salt Lake City"
  | "San Francisco"
  | "San Jose"
  | "San Mateo"
  | "San Rafael"
  | "Santa Ana"
  | "Santa Cruz"
  | "São Paulo"
  | "Seattle"
  | "Silver Spring"
  | "Singapore"
  | "Stamford"
  | "Stockholm"
  | "Sunnyvale"
  | "Sydney"
  | "Tel Aviv"
  | "Tokyo"
  | "Toronto"
  | "Vancouver"
  | "Washington"
  | "West Hollywood"
  | "West Palm Beach"
  | "Woodstock"
  | "Youngstown";

export type OfficePreference =
  | "Remote"
  | "Hybrid"
  | "In-Office";

export type TrackingPreferences = {
  stages: CompanyStage[];
  sectors: CompanySector[];
  locations: CompanyLocation[];
  office_preferences: OfficePreference[];
};

export const COMPANY_STAGES: CompanyStage[] = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Series D",
  "Venture"
];

export const OFFICE_PREFERENCES: OfficePreference[] = [
  "Remote",
  "Hybrid",
  "In-Office"
];

