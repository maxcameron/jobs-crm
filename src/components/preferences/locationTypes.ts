
import { CompanyLocation } from "./types";

export interface USRegion {
  name: string;
  locations: CompanyLocation[];
}

export interface LocationGroup {
  [country: string]: {
    regions?: {
      [region: string]: CompanyLocation[];
    };
    locations?: CompanyLocation[];
  };
}

export const US_REGIONS: { [key: string]: CompanyLocation[] } = {
  "Massachusetts": [
    "Boston",
    "Brookline",
    "Cambridge",
    "Canton"
  ],
  "New York": [
    "New York",
    "Brooklyn"
  ],
  "Florida": [
    "Miami",
    "North Miami Beach",
    "West Palm Beach"
  ],
  "Georgia": [
    "Atlanta",
    "Norcross",
    "Woodstock"
  ],
  "Illinois": [
    "Chicago"
  ],
  "Michigan": [
    "Detroit"
  ],
  "Texas": [
    "Austin"
  ],
  "California": [
    "Mill Valley",
    "Newport Beach",
    "El Segundo",
    "Mountain View",
    "Costa Mesa",
    "San Francisco",
    "Los Angeles",
    "San Jose",
    "Oakland",
    "Palo Alto",
    "Menlo Park",
    "San Mateo",
    "San Rafael",
    "Los Altos",
    "Sunnyvale",
    "Foster City",
    "Campbell",
    "Irvine",
    "West Hollywood"
  ],
  "Washington": [
    "Seattle",
    "Redmond"
  ],
  "Colorado": [
    "Denver",
    "Greenwood Village"
  ],
  "Connecticut": [
    "Newton",
    "Stamford"
  ],
  "Delaware": [
    "Lewes"
  ],
  "New Jersey": [
    "Holmdel",
    "Jersey City"
  ],
  "North Carolina": [
    "Charlotte",
    "Raleigh"
  ],
  "Ohio": [
    "Columbus",
    "Youngstown",
    "Newbury"
  ],
  "Oregon": [
    "Portland",
    "Bend"
  ],
  "Pennsylvania": [
    "Berwyn",
    "Pittsburg"
  ],
  "Utah": [
    "Salt Lake City",
    "Lehi"
  ],
  "Virginia": [
    "Arlington",
    "McLean",
    "Herndon"
  ],
  "Maryland": [
    "Silver Spring"
  ],
  "Other": [
    "Distributed"
  ]
} as const;

export const COUNTRY_LOCATIONS: LocationGroup = {
  "United States": {
    regions: US_REGIONS,
  },
  "United Kingdom": {
    locations: ["London"]
  },
  "Germany": {
    locations: ["Berlin", "Munich", "Karlsruhe", "Cologne"]
  },
  "Israel": {
    locations: ["Tel Aviv", "Or Yehuda"]
  },
  "France": {
    locations: ["Paris", "Rennes"]
  },
  "Canada": {
    locations: ["Toronto", "Burnaby", "Vancouver"]
  },
  "Colombia": {
    locations: ["Medellín"]
  },
  "Sweden": {
    locations: ["Stockholm"]
  },
  "Brazil": {
    locations: ["São Paulo"]
  },
  "UAE": {
    locations: ["Abu Dhabi"]
  },
  "Cayman Islands": {
    locations: ["George Town"]
  },
  "India": {
    locations: ["Mumbai", "Gurugram", "Jaipur", "Bengaluru"]
  },
  "Belgium": {
    locations: ["Louvain-la-Neuve"]
  },
  "Indonesia": {
    locations: ["Jakarta"]
  },
  "Italy": {
    locations: ["Pesaro"]
  },
  "Singapore": {
    locations: ["Singapore"]
  }
} as const;
