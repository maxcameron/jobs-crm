
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
    title: "Company Location",
    description: "Which company locations are you open to? You may not want to track companies based on timezone preferences and other factors.",
    component: "locations"
  },
  {
    title: "Work Arrangement",
    description: "What's your preferred work arrangement?",
    component: "office"
  }
];
