// src/lib/api.ts

export interface PredictionResponse {
  status: string;
  top_prediction: string;
  top_confidence: number;
  all_models: {
    algorithm: string;
    predicted_disease: string;
    confidence: number;
  }[];
}

export const getPrediction = async (selectedSymptoms: string[]): Promise<PredictionResponse> => {
  try {
    const response = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // This matches the {"selected_symptoms": [...]} format your FastAPI server expects
      body: JSON.stringify({ selected_symptoms: selectedSymptoms }), 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PredictionResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching prediction:", error);
    throw error;
  }
};