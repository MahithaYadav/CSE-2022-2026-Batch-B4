// src/data/diseaseDetails.ts

export const DISEASE_DETAILS: Record<string, { description: string; precautions: string[] }> = {
  "Diabetes ": {
    description: "A chronic condition that affects how your body turns food into energy.",
    precautions: ["Reduce sugar intake", "Regular exercise", "Monitor glucose levels"]
  },
  "Bronchial Asthma": {
    description: "A condition in which your airways narrow and swell and may produce extra mucus.",
    precautions: ["Use inhaler", "Avoid dust/smoke", "Breathing exercises"]
  },
  "Jaundice": {
    description: "Yellowing of the skin caused by high bilirubin levels in the blood.",
    precautions: ["Drink plenty of water", "Avoid oily food", "Rest well"]
  },
  "Tuberculosis": {
    description: "A serious infectious bacterial disease that mainly affects the lungs.",
    precautions: ["Complete medication course", "Wear a mask", "Proper ventilation"]
  },
  "Pneumonia": {
    description: "Infection that inflames air sacs in one or both lungs, which may fill with fluid.",
    precautions: ["Take antibiotics as prescribed", "Rest", "Stay hydrated"]
  },
  "Heart attack": {
    description: "A blockage of blood flow to the heart muscle.",
    precautions: ["Emergency medical help", "Chew Aspirin", "Rest quietly"]
  }
};