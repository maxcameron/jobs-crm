
export type CompanyStage =
  | "Pre-Seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C"
  | "Series D"
  | "Venture";

export type CompanySector =
  | "AI & Machine Learning"
  | "AI"
  | "Web3/Crypto"
  | "Blockchain"
  | "Developer Tools"
  | "Enterprise Software"
  | "E-commerce"
  | "E-Commerce"
  | "FinTech"
  | "Fintech"
  | "HealthTech"
  | "EdTech"
  | "PropTech"
  | "Clean Energy"
  | "Climate Tech"
  | "Marketing Technology"
  | "Business and Productivity Software"
  | "Procurement Tech"
  | "Marketplace"
  | "Logistics"
  | "SaaS"
  | "Automotive"
  | "Energy"
  | "Construction Technology"
  | "Home Services"
  | "Communication Software"
  | "Industrial Technology"
  | "Medical Technology"
  | "HR Tech"
  | "Sales Tech"
  | "Event Technology"
  | "Legal Tech"
  | "Media and Information Services"
  | "Advertising Technology"
  | "Travel Technology"
  | "Data Infrastructure"
  | "Recreation Tech"
  | "InsurTech"
  | "FoodTech"
  | "AgTech"
  | "Market Intelligence"
  | "Manufacturing"
  | "Customer Experience Technology"
  | "Recruitment Technology"
  | "Retail Technology"
  | "Professional Training and Coaching"
  | "Government Technology"
  | "Sustainability Technology"
  | "Childcare Services"
  | "Business Intelligence"
  | "Entertainment Software"
  | "Customer Support Technology"
  | "Mobility"
  | "Nonprofit Tech";

export type CompanyLocation =
  | "Boston"
  | "New York"
  | "Miami"
  | "Chicago"
  | "Austin"
  | "San Francisco"
  | "Los Angeles"
  | "Seattle"
  | "London"
  | "Berlin"
  | "Paris"
  | "Toronto"
  | "Vancouver"
  | "Brooklyn"
  | "San Jose"  // Fixed casing to match database
  | "Woodstock"
  | "Denver"
  | "Menlo Park"
  | "Charlotte"
  | "Atlanta"
  | "San Mateo"
  | "Lehi"
  | "Salt Lake City"
  | "Brookline"
  | "Palo Alto"
  | "Detroit"
  | "Munich"
  | "Tel Aviv"
  | "Santa Cruz"
  | "Newton"
  | "Campbell"
  | "Omaha"
  | "Bend"
  | "Medellín"
  | "Oakland"
  | "Or Yehuda"
  | "San Rafael"
  | "Silver Spring"
  | "North Miami Beach"
  | "Los Altos"
  | "Stamford"
  | "Columbus"
  | "Stockholm"
  | "Sunnyvale"
  | "Foster City"
  | "Holmdel"
  | "Berwyn"
  | "West Palm Beach"
  | "Lewes"
  | "West Hollywood"
  | "Distributed"
  | "Irvine"
  | "Portland"
  | "Greenwood Village"
  | "Redmond"
  | "Jersey City"
  | "Raleigh"
  | "Arlington"
  | "Youngstown"
  | "George Town"
  | "Canton"
  | "Karlsruhe"
  | "São Paulo"
  | "Abu Dhabi"
  | "Amsterdam"
  | "Singapore"
  | "Sydney"
  | "Dublin"
  | "Tokyo";

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
