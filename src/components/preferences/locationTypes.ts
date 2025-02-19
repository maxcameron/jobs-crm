
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
    "Boston, MA",
    "New York, NY",
    "Brooklyn, NY",
    "Brookline, MA",
    "Newton, CT",
    "Stamford, CT",
    "Jersey City, NJ",
    "Holmdel, NJ",
  ],
  Southeast: [
    "Miami, FL",
    "Atlanta, GA",
    "Charlotte, NC",
    "Raleigh, NC",
    "West Palm Beach, Florida",
    "North Miami Beach, FL",
    "Woodstock, GA",
  ],
  Midwest: [
    "Chicago, IL",
    "Detroit, MI",
    "Columbus, OH",
    "Youngstown, OH",
    "Omaha, NE",
    "Des Moines, IA",
    "Kansas City, MO",
  ],
  Southwest: [
    "Austin, TX",
    "Phoenix, AZ",
    "Arlington, VA",
  ],
  "West Coast": [
    "San Francisco, CA",
    "Los Angeles, CA",
    "Seattle, WA",
    "Portland, OR",
    "San Jose, CA",
    "Oakland, CA",
    "Palo Alto, CA",
    "Menlo Park, CA",
    "Redwood City, CA",
    "Santa Cruz, CA",
    "San Mateo, CA",
    "San Rafael, CA",
    "Los Altos, CA",
    "Sunnyvale, CA",
    "Foster City, CA",
    "Campbell, CA",
    "Santa Ana, CA",
    "Irvine, CA",
    "West Hollywood, CA",
  ],
  Mountain: [
    "Denver, CO",
    "Salt Lake City, UT",
    "Lehi, UT",
    "Greenwood Village, CO",
    "Bend, OR",
  ],
  Other: [
    "Distributed, United States",
    "Washington, DC",
    "Silver Spring, MD",
    "Middletown, DE",
    "Lewes, DE",
    "Berwyn, PA",
  ],
} as const;

export const COUNTRY_LOCATIONS: LocationGroup = {
  "United States": {
    regions: US_REGIONS,
  },
  "United Kingdom": {
    locations: ["London, UK"],
  },
  "Germany": {
    locations: ["Munich, Germany", "Berlin, Germany", "Karlsruhe, Germany"],
  },
  "Israel": {
    locations: ["Tel Aviv, Israel", "Or Yehuda, Israel"],
  },
  "France": {
    locations: ["Paris, France"],
  },
  "Canada": {
    locations: ["Toronto, Canada"],
  },
  "Colombia": {
    locations: ["Medellín, Colombia"],
  },
  "Sweden": {
    locations: ["Stockholm, Sweden"],
  },
  "Brazil": {
    locations: ["São Paulo, Brazil"],
  },
  "UAE": {
    locations: ["Abu Dhabi, UAE"],
  },
  "Cayman Islands": {
    locations: ["George Town, Cayman Islands"],
  },
};
