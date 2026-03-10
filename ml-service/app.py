from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import shap
import os

app = Flask(__name__)
CORS(app)

# Load models
MODEL_DIR = 'models'
binary_model = None
multi_model = None
binary_features = None
multiclass_features = None
explainer_bin = None
explainer_multi = None

# Feature definitions
BINARY_FEATURES = [
    "Age", "Bilirubin", "AlkPhosphate", "Sgot",
    "Albumin", "Protime", "Fatigue", "Malaise", "Anorexia"
]

MULTICLASS_FEATURES = [
    "Age", "Bilirubin", "AlkPhosphate", "Sgot",
    "Albumin", "Protime", "Fatigue", "Malaise", "Anorexia",
    "HBsAg", "Anti_HCV", "Anti_HAV_IgM", "Anti_HEV_IgM",
    "Unsafe_Blood_Exposure", "IV_Drug_Use",
    "Contaminated_Food_Water", "Sexual_Exposure",
    "Infection_Duration_Months", "Acute_or_Chronic",
    "HepA_Vaccinated", "HepB_Vaccinated"
]

MEDICAL_REASONING = {
    "Bilirubin": "Elevated bilirubin suggests impaired liver function",
    "Sgot": "High SGOT indicates liver cell injury",
    "Albumin": "Low albumin may indicate chronic liver dysfunction",
    "Protime": "Prolonged prothrombin time reflects reduced liver synthesis",
    "Fatigue": "Fatigue is a common symptom of hepatitis",
    "Malaise": "Malaise is often associated with viral infections",
    "Anorexia": "Loss of appetite is a common early hepatitis symptom",
    "HBsAg": "Presence of HBsAg indicates Hepatitis B infection",
    "Anti_HCV": "Anti-HCV antibodies indicate Hepatitis C exposure",
    "Anti_HAV_IgM": "Anti-HAV IgM indicates acute Hepatitis A infection",
    "Anti_HEV_IgM": "Anti-HEV IgM suggests acute Hepatitis E infection",
    "Unsafe_Blood_Exposure": "History of unsafe blood exposure increases viral hepatitis risk",
    "IV_Drug_Use": "IV drug use is a major risk factor for Hepatitis C and B",
    "Contaminated_Food_Water": "Contaminated food/water is linked to Hepatitis A and E",
    "Sexual_Exposure": "Unprotected sexual exposure increases Hepatitis B risk",
    "Infection_Duration_Months": "Long infection duration suggests chronic hepatitis",
    "Acute_or_Chronic": "Chronic infection indicates prolonged liver involvement",
    "HepA_Vaccinated": "Hepatitis A vaccination reduces risk of HAV infection",
    "HepB_Vaccinated": "Hepatitis B vaccination reduces risk of HBV infection"
}

def load_models():
    global binary_model, multi_model, binary_features, multiclass_features
    global explainer_bin, explainer_multi
    
    try:
        binary_model = joblib.load(f'{MODEL_DIR}/best_binary_model.pkl')
        multi_model = joblib.load(f'{MODEL_DIR}/best_multiclass_model.pkl')
        binary_features = joblib.load(f'{MODEL_DIR}/binary_features.pkl')
        multiclass_features = joblib.load(f'{MODEL_DIR}/multiclass_features.pkl')
        
        # Initialize SHAP explainers
        try:
            model_core = binary_model.named_steps["model"]
            explainer_bin = shap.TreeExplainer(model_core)
        except:
            pass
            
        try:
            model_core = multi_model.named_steps["model"]
            explainer_multi = shap.TreeExplainer(model_core)
        except:
            pass
        
        print("✅ Models loaded successfully!")
        return True
    except Exception as e:
        print(f"⚠️ Error loading models: {e}")
        return False

load_models()

def get_risk_category(probability):
    if probability < 0.30:
        return "Low"
    elif probability < 0.70:
        return "Moderate"
    else:
        return "High"

def generate_medical_explanation(shap_dict, input_data, top_n=3):
    sorted_features = sorted(shap_dict.items(), key=lambda x: abs(x[1]), reverse=True)[:top_n]
    explanations = []
    
    for feature, shap_value in sorted_features:
        if feature in MEDICAL_REASONING:
            feature_value = input_data.get(feature, None)
            direction = "increased risk" if shap_value > 0 else "reduced risk"
            explanations.append({
                'feature': feature,
                'value': feature_value,
                'impact': float(shap_value),
                'explanation': f"{MEDICAL_REASONING[feature]}. This {direction}."
            })
    
    return explanations

def get_medical_recommendation(risk_category, hepatitis_detected, hepatitis_type=None):
    recommendations = []
    
    if hepatitis_detected:
        if hepatitis_type and hepatitis_type != "Inconclusive":
            recommendations.append({
                'priority': 'urgent',
                'action': f'See a liver specialist (Hepatologist) immediately',
                'reason': f'Hepatitis Type {hepatitis_type} detected. You need specialized treatment to prevent liver damage.'
            })
            
            recommendations.append({
                'priority': 'high',
                'action': 'Get complete viral load and liver function tests',
                'reason': 'These tests will show how active the virus is and how well your liver is working.'
            })
            
            recommendations.append({
                'priority': 'high',
                'action': 'Stop drinking alcohol completely',
                'reason': 'Alcohol can make liver damage worse. Avoid it to protect your liver.'
            })
            
            recommendations.append({
                'priority': 'medium',
                'action': 'Eat liver-friendly foods (fruits, vegetables, whole grains)',
                'reason': 'Good nutrition helps your liver heal and stay strong.'
            })
            
            recommendations.append({
                'priority': 'medium',
                'action': 'Tell your close contacts to get tested',
                'reason': 'Hepatitis can spread to family members. They should get checked and vaccinated.'
            })
        else:
            recommendations.append({
                'priority': 'urgent',
                'action': 'Visit a doctor within 24-48 hours',
                'reason': 'Hepatitis detected but type unclear. You need blood tests to identify which type you have.'
            })
        
            recommendations.append({
                'priority': 'high',
                'action': 'Get complete liver function panel and viral markers',
                'reason': 'These tests will identify the exact type of hepatitis and how severe it is.'
            })
        
            recommendations.append({
                'priority': 'high',
                'action': 'Avoid alcohol and pain medications (like paracetamol)',
                'reason': 'These can harm your liver. Avoid them until you see a doctor.'
            })
        
            recommendations.append({
                'priority': 'medium',
                'action': 'Rest and drink plenty of water',
                'reason': 'Your body needs energy to fight the infection. Get enough sleep and stay hydrated.'
            })
    else:
        # No hepatitis detected
        if risk_category == "Moderate":
            recommendations.append({
                'priority': 'medium',
                'action': 'Get a liver function test every 6 months',
                'reason': 'Your results show moderate risk. Regular monitoring helps catch problems early.'
            })
            
            recommendations.append({
                'priority': 'medium',
                'action': 'Reduce alcohol intake or quit completely',
                'reason': 'Alcohol can damage your liver over time. Cutting back protects your liver health.'
            })
            
            recommendations.append({
                'priority': 'low',
                'action': 'Maintain a healthy weight through diet and exercise',
                'reason': 'Being overweight can lead to fatty liver disease. Stay active and eat healthy.'
            })
        else:
            # Low risk
            recommendations.append({
                'priority': 'low',
                'action': 'Get a health checkup once a year',
                'reason': 'Annual checkups help you stay healthy and catch any problems early.'
            })
            
            recommendations.append({
                'priority': 'low',
                'action': 'Eat a balanced diet with fruits and vegetables',
                'reason': 'Good nutrition keeps your liver healthy and strong.'
            })
        
        # Common recommendations for no hepatitis
        recommendations.append({
            'priority': 'low',
            'action': 'Get vaccinated for Hepatitis A and B if not already done',
            'reason': 'Vaccines protect you from getting hepatitis in the future. They are safe and effective.'
        })
        
        recommendations.append({
            'priority': 'low',
            'action': 'Practice good hygiene (wash hands, safe food handling)',
            'reason': 'Clean hands and safe food prevent Hepatitis A and E infections.'
        })
        
        recommendations.append({
            'priority': 'low',
            'action': 'Avoid sharing needles, razors, or toothbrushes',
            'reason': 'These items can spread Hepatitis B and C through blood contact.'
        })
    
    return recommendations

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "binary_model_loaded": binary_model is not None,
        "multiclass_model_loaded": multi_model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # ================ BINARY STAGE ================
        binary_input = {k: data.get(k) for k in BINARY_FEATURES}
        binary_df = pd.DataFrame([binary_input])
        
        # Predict
        prob = float(binary_model.predict_proba(binary_df)[0][1])
        risk = get_risk_category(prob)
        detected = bool(prob >= 0.5)  # Standard threshold
        
        result = {
            'stage': 'binary',
            'hepatitis_detected': detected,
            'confidence': round(prob, 3),
            'risk_category': risk,
            'probabilities': {
                'negative': round(1 - prob, 3),
                'positive': round(prob, 3)
            }
        }
        
        # Binary SHAP explanation
        try:
            model_core = binary_model.named_steps["model"]
            binary_preprocessed = binary_model[:-1].transform(binary_df)
            
            if explainer_bin:
                shap_values_bin = explainer_bin(binary_preprocessed)
                
                if len(shap_values_bin.values.shape) == 3:
                    shap_values_class1 = shap_values_bin.values[0][1]
                else:
                    shap_values_class1 = shap_values_bin.values[0]
                
                shap_dict_bin = dict(zip(binary_df.columns, shap_values_class1.tolist()))
                result['binary_explanations'] = generate_medical_explanation(
                    shap_dict_bin, binary_input
                )
        except Exception as e:
            result['binary_explanations'] = []
        
        # ================ MULTICLASS STAGE ================
        if detected:
            multiclass_input = {k: data.get(k) for k in MULTICLASS_FEATURES}
            multiclass_df = pd.DataFrame([multiclass_input])
            
            probs = multi_model.predict_proba(multiclass_df)[0]
            max_prob = float(probs.max())
            pred_class = multi_model.classes_[probs.argmax()]
            
            # Use 35% threshold for classification
            if max_prob < 0.35:
                result['hepatitis_type'] = "Inconclusive"
                result['type_confidence'] = round(max_prob, 3)
            else:
                result['hepatitis_type'] = pred_class
                result['type_confidence'] = round(max_prob, 3)
            
            # Type probabilities - show all types
            result['type_probabilities'] = {
                str(cls): round(float(prob), 3) 
                for cls, prob in zip(multi_model.classes_, probs)
            }
            
            # Sort probabilities to show most likely types
            sorted_probs = sorted(
                result['type_probabilities'].items(), 
                key=lambda x: x[1], 
                reverse=True
            )
            result['type_probabilities_sorted'] = sorted_probs
            
            # Multiclass SHAP explanation
            try:
                model_core = multi_model.named_steps["model"]
                
                if explainer_multi:
                    shap_values_multi = explainer_multi(multiclass_df)
                    
                    if len(shap_values_multi.values.shape) == 3:
                        class_index = probs.argmax()
                        shap_values = shap_values_multi.values[0][:, class_index]
                    else:
                        shap_values = shap_values_multi.values[0]
                    
                    shap_dict_multi = dict(zip(multiclass_df.columns, shap_values.tolist()))
                    result['multiclass_explanations'] = generate_medical_explanation(
                        shap_dict_multi, multiclass_input
                    )
            except Exception as e:
                result['multiclass_explanations'] = []
        
        # Recommendations
        hepatitis_type = result.get('hepatitis_type', None)
        result['recommendations'] = get_medical_recommendation(
            risk, detected, hepatitis_type
        )
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
