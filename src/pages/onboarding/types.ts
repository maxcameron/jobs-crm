
export type OnboardingStep = {
  title: string;
  description: string;
  component: "stages" | "sectors" | "locations" | "office";
};

export const STEPS: OnboardingStep[] = [
  {
    title: "Company Stage",
    description: "What stage companies are you interested in?",
    component: "stages"
  },
  {
    title: "Industry Sectors",
    description: "Which sectors interest you the most?",
    component: "sectors"
  },
  {
    title: "Locations",
    description: "Where would you like to work?",
    component: "locations"
  },
  {
    title: "Work Arrangement",
    description: "What's your preferred work arrangement?",
    component: "office"
  }
];
