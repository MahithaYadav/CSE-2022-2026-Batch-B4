// src/data/diseaseData.ts

export interface DiseaseProfile {
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export const SYMPTOM_CATEGORIES = [
  {
    id: "head",
    name: "Head & Vision",
    symptoms: ["headache", "blurred_and_distorted_vision", "yellowing_of_eyes"]
  },
  {
    id: "chest",
    name: "Respiratory & Chest",
    symptoms: ["cough", "breathlessness", "chest_pain", "phlegm"]
  },
  {
    id: "skin",
    name: "Skin & External",
    symptoms: ["itching", "skin_rash", "yellowish_skin"]
  },
  {
    id: "general",
    name: "General",
    symptoms: ["fatigue", "high_fever", "chills", "lethargy"]
  }
];
export const DATA_VERSION = "1.0.1";