
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
  "Massachusetts": [
    "Boston",
  ],
  "New York": [
    "New York",
  ],
  "Florida": [
    "Miami",
  ],
  "Georgia": [
    "Atlanta",
  ],
  "Illinois": [
    "Chicago",
  ],
  "Michigan": [
    "Detroit",
  ],
  "Texas": [
    "Austin",
  ],
  "California": [
    "San Francisco",
    "Los Angeles",
  ],
  "Washington": [
    "Seattle",
  ],
  "Colorado": [
    "Denver",
  ],
};

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
