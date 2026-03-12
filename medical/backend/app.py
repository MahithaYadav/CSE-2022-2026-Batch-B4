from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
import joblib

app = FastAPI(title="HealthHint Foresee API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models
models = {}
new_df = None

try:
    # Ensure filenames match your models folder
    model_list = ['Logistic Regression', 'Decision Tree', 'Random Forest', 'SVM', 'AdaBoost', 'XGBoost']
    for name in model_list:
        path = f"models/{name.lower().replace(' ', '_')}.pkl"
        models[name] = joblib.load(path)
    
    new_df = pd.read_csv('models/disease_mapping.csv')
    print("✅ Models and Mappings loaded.")
except Exception as e:
    print(f"❌ Error: {e}")

# Features list (132 + random)
FEATURES = ['itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition', 'spotting_ urination', 'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine', 'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach', 'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips', 'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of urine', 'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)', 'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain', 'abnormal_menstruation', 'dischromic _patches', 'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen', 'history_of_alcohol_consumption', 'fluid_overload.1', 'blood_in_sputum', 'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze', 'random']

class SymptomInput(BaseModel):
    selected_symptoms: List[str]

@app.post("/predict")
def predict_disease(data: SymptomInput):
    input_dict = {f: 0 for f in FEATURES}
    input_dict['random'] = 0.525
    for s in data.selected_symptoms:
        clean = s.lower().replace(" ", "_")
        if clean in input_dict: input_dict[clean] = 1
            
    df_test = pd.DataFrame([input_dict])
    predictions_data = []
    
    # 1. Individual Predictions
    for name, model in models.items():
        pred_code = model.predict(df_test)[0]
        disease = new_df[new_df['Encoded'] == pred_code]["Prognosis"].values[0]
        try:
            probs = model.predict_proba(df_test)
            conf = float(np.max(probs) * 100)
        except:
            conf = 100.0 if "SVM" in name else 0.0
        predictions_data.append({"algorithm": name, "predicted_disease": disease, "confidence": conf})

    # 2. Ensemble Logic (Soft Voting)
    votes = {}
    total_models = len(models)
    for p in predictions_data:
        d = p["predicted_disease"]
        if d not in votes: votes[d] = {"total_conf": 0, "count": 0}
        votes[d]["total_conf"] += p["confidence"]
        votes[d]["count"] += 1

    ensemble_list = []
    for disease, v_data in votes.items():
        # Weighted Average Score
        score = v_data["total_conf"] / total_models
        ensemble_list.append({
            "disease": disease, 
            "score": round(score, 2), 
            "agreement": f"{v_data['count']}/{total_models}"
        })

    # Sort and pick winner
    winner = sorted(ensemble_list, key=lambda x: x["score"], reverse=True)[0]

    return {
        "status": "success",
        "top_prediction": winner["disease"],
        "top_confidence": winner["score"],
        "agreement": winner["agreement"],
        "all_models": predictions_data
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)