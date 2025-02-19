
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
    "Brookline",
    "Canton",
  ],
  "New York": [
    "New York",
    "Brooklyn",
  ],
  "Florida": [
    "Miami",
    "North Miami Beach",
    "West Palm Beach",
  ],
  "Georgia": [
    "Atlanta",
    "Woodstock",
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
    "San Jose",
    "Oakland",
    "Palo Alto",
    "Menlo Park",
    "Redwood City",
    "Santa Cruz",
    "San Mateo",
    "San Rafael",
    "Los Altos",
    "Sunnyvale",
    "Foster City",
    "Campbell",
    "Santa Ana",
    "Irvine",
    "West Hollywood",
    "Fort Collins",
  ],
  "Washington": [
    "Seattle",
    "Redmond",
  ],
  "Colorado": [
    "Denver",
    "Greenwood Village",
  ],
  "Connecticut": [
    "Newton",
    "Stamford",
  ],
  "Delaware": [
    "Middletown",
    "Lewes",
  ],
  "District of Columbia": [
    "Washington",
  ],
  "Iowa": [
    "Des Moines",
  ],
  "Missouri": [
    "Kansas City",
  ],
  "Nebraska": [
    "Omaha",
  ],
  "New Jersey": [
    "Holmdel",
    "Jersey City",
  ],
  "North Carolina": [
    "Charlotte",
    "Raleigh",
  ],
  "Ohio": [
    "Columbus",
    "Youngstown",
  ],
  "Oregon": [
    "Portland",
    "Bend",
  ],
  "Pennsylvania": [
    "Berwyn",
  ],
  "Utah": [
    "Salt Lake City",
    "Lehi",
  ],
  "Virginia": [
    "Arlington",
  ],
  "Maryland": [
    "Silver Spring",
  ],
  "Other": [
    "Distributed",
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
    locations: ["Medellín"],
  },
  "Sweden": {
    locations: ["Stockholm"],
  },
  "Brazil": {
    locations: ["São Paulo"],
  },
  "UAE": {
    locations: ["Abu Dhabi"],
  },
  "Cayman Islands": {
    locations: ["George Town"],
  },
};
