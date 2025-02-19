
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

export const US_REGIONS = {
  Northeast: [
    "Boston",
    "New York",
  ],
  Southeast: [
    "Miami",
    "Atlanta",
  ],
  Midwest: [
    "Chicago",
    "Detroit",
  ],
  Southwest: [
    "Austin",
  ],
  "West Coast": [
    "San Francisco",
    "Los Angeles",
    "Seattle",
  ],
  Mountain: [
    "Denver",
  ],
  Other: [
    "Boston",
    "Austin",
  ],
} as const;

export const COUNTRY_LOCATIONS: LocationGroup = {
  "United States": {
    regions: US_REGIONS,
  },
  "United Kingdom": {
    locations: ["London"],
  },
  "Germany": {
    locations: ["Berlin"],
  },
  "Israel": {
    locations: ["Tel Aviv"],
  },
  "France": {
    locations: ["Paris"],
  },
  "Canada": {
    locations: ["Toronto"],
  },
  "Colombia": {
    locations: ["San Francisco"],
  },
  "Sweden": {
    locations: ["Stockholm"],
  },
  "Brazil": {
    locations: ["San Francisco"],
  },
  "UAE": {
    locations: ["Singapore"],
  },
  "Cayman Islands": {
    locations: ["London"],
  },
};
