
export type CompanyStage =
  | "Pre-seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C"
  | "Series D"
  | "Series E"
  | "Series F"
  | "Growth"
  | "Public"
  | "Acquired";

export type CompanySector =
  | "AI & Machine Learning"
  | "Web3/Crypto"
  | "Developer Tools"
  | "Enterprise Software"
  | "E-commerce"
  | "FinTech"
  | "HealthTech"
  | "EdTech"
  | "PropTech"
  | "Clean Energy"
  | "Climate Tech";

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
  | "Brooklyn"
  | "San Jose"
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
  | "Abu Dhabi";

export type OfficePreference =
  | "Remote"
  | "Hybrid"
  | "In-office"
  | "Remote-friendly";

export type TrackingPreferences = {
  stages: CompanyStage[];
  sectors: CompanySector[];
  locations: CompanyLocation[];
  office_preferences: OfficePreference[];
};

export const COMPANY_STAGES: CompanyStage[] = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Series D",
  "Series E",
  "Series F",
  "Growth",
  "Public",
  "Acquired",
];

export const OFFICE_PREFERENCES: OfficePreference[] = [
  "Remote",
  "Hybrid",
  "In-office",
  "Remote-friendly",
];
