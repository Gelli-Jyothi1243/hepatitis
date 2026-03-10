import React, { useState } from "react";
import axios from "axios";

function Prediction() {
  const [binaryData, setBinaryData] = useState({
    Age: "",
    Bilirubin: "",
    AlkPhosphate: "",
    Sgot: "",
    Albumin: "",
    Protime: "",
    Fatigue: "0",
    Malaise: "0",
    Anorexia: "0"
  });

  const [multiData, setMultiData] = useState({
    Unsafe_Blood_Exposure: "0",
    IV_Drug_Use: "0",
    Contaminated_Food_Water: "0",
    Sexual_Exposure: "0",
    Infection_Duration_Months: "",
    Acute_or_Chronic: "0",
    HepA_Vaccinated: "0",
    HepB_Vaccinated: "0"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBinaryChange = (e) => {
    const { name, value } = e.target;
    // Prevent negative values for numeric inputs
    if (value !== '' && !isNaN(value) && parseFloat(value) < 0) {
      return;
    }
    setBinaryData({ ...binaryData, [name]: value });
  };

  const handleMultiChange = (e) => {
    const { name, value } = e.target;
    // Prevent negative values for numeric inputs
    if (name === 'Infection_Duration_Months' && value !== '' && !isNaN(value) && parseFloat(value) < 0) {
      return;
    }
    setMultiData({ ...multiData, [name]: value });
  };

  const handlePredict = async () => {
    const requiredFields = ['Age', 'Bilirubin', 'AlkPhosphate', 'Sgot', 'Albumin', 'Protime'];
    const missingFields = requiredFields.filter(field => !binaryData[field] || binaryData[field] === '');
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields`);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const userId = localStorage.getItem("userId");
      
      const payload = {
        Age: parseFloat(binaryData.Age),
        Bilirubin: parseFloat(binaryData.Bilirubin),
        AlkPhosphate: parseFloat(binaryData.AlkPhosphate),
        Sgot: parseFloat(binaryData.Sgot),
        Albumin: parseFloat(binaryData.Albumin),
        Protime: parseFloat(binaryData.Protime),
        Fatigue: parseInt(binaryData.Fatigue),
        Malaise: parseInt(binaryData.Malaise),
        Anorexia: parseInt(binaryData.Anorexia),
        // Viral markers - set to 0 (negative) since we're predicting without expensive tests
        HBsAg: 0,
        Anti_HCV: 0,
        Anti_HAV_IgM: 0,
        Anti_HEV_IgM: 0,
        // Risk factors
        Unsafe_Blood_Exposure: parseInt(multiData.Unsafe_Blood_Exposure),
        IV_Drug_Use: parseInt(multiData.IV_Drug_Use),
        Contaminated_Food_Water: parseInt(multiData.Contaminated_Food_Water),
        Sexual_Exposure: parseInt(multiData.Sexual_Exposure),
        Infection_Duration_Months: parseFloat(multiData.Infection_Duration_Months) || 0,
        Acute_or_Chronic: parseInt(multiData.Acute_or_Chronic),
        HepA_Vaccinated: parseInt(multiData.HepA_Vaccinated),
        HepB_Vaccinated: parseInt(multiData.HepB_Vaccinated)
      };
      
      if (userId) {
        payload.userId = userId;
      }

      const response = await axios.post("http://localhost:5000/api/prediction/predict", payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', sans-serif; }
        
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 32px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
        .subtitle { font-size: 15px; color: #64748b; }
        
        .info-banner { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 30px; }
        .info-banner-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
        .info-banner-text { font-size: 14px; line-height: 1.6; opacity: 0.95; }
        
        .split-layout { display: grid; grid-template-columns: 1fr 380px; gap: 25px; }
        
        .form-side { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
        .help-side { background: #f8fafc; padding: 25px; border-radius: 12px; border: 2px solid #e2e8f0; position: sticky; top: 20px; max-height: calc(100vh - 40px); overflow-y: auto; }
        
        .section-title { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .section-subtitle { font-size: 13px; color: #64748b; margin-bottom: 20px; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .form-group { display: flex; flex-direction: column; }
        .form-label { font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; }
        .form-input, .form-select { padding: 11px 14px; border-radius: 8px; border: 2px solid #e2e8f0; font-size: 14px; transition: all 0.2s; }
        .form-input:focus, .form-select:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        
        .radio-group { display: flex; gap: 10px; }
        .radio-label { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; border: 2px solid #e2e8f0; cursor: pointer; font-size: 13px; transition: all 0.2s; background: #f8fafc; }
        .radio-label:hover { border-color: #3b82f6; background: white; }
        .radio-label input { cursor: pointer; }
        
        .btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 25px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        
        .help-header { font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .help-item { margin-bottom: 14px; padding: 14px; background: white; border-radius: 8px; border-left: 3px solid #3b82f6; }
        .help-item-title { font-weight: 600; font-size: 13px; color: #1e293b; margin-bottom: 5px; }
        .help-item-text { font-size: 12px; color: #64748b; line-height: 1.5; }
        
        .help-tip { background: #dbeafe; padding: 12px; border-radius: 8px; margin-top: 16px; border-left: 3px solid #3b82f6; }
        .help-tip-text { font-size: 12px; color: #1e40af; line-height: 1.5; }
        
        .error { background: #fee2e2; color: #991b1b; padding: 14px; border-radius: 8px; margin-top: 16px; font-size: 14px; border-left: 3px solid #dc2626; }
        
        .result-card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); margin-top: 30px; }
        .result-header { text-align: center; padding: 30px; border-radius: 12px; margin-bottom: 25px; }
        .result-icon { font-size: 56px; margin-bottom: 12px; }
        .result-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .result-subtitle { font-size: 16px; opacity: 0.9; }
        .result-type { display: inline-block; margin-top: 12px; padding: 8px 20px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 15px; font-weight: 600; }
        
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 25px; }
        .metric { background: #f8fafc; padding: 18px; border-radius: 10px; text-align: center; }
        .metric-label { font-size: 12px; color: #64748b; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-value { font-size: 26px; font-weight: 700; color: #1e293b; }
        
        .recommendations { margin-top: 25px; }
        .rec-title { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 16px; }
        .rec-item { padding: 16px; margin-bottom: 12px; border-radius: 10px; border-left: 4px solid; }
        .rec-urgent { background: #fef2f2; border-color: #dc2626; }
        .rec-high { background: #fff7ed; border-color: #ea580c; }
        .rec-medium { background: #fefce8; border-color: #ca8a04; }
        .rec-low { background: #f0fdf4; border-color: #16a34a; }
        .rec-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
        .badge-urgent { background: #fee2e2; color: #991b1b; }
        .badge-high { background: #fed7aa; color: #9a3412; }
        .badge-medium { background: #fef3c7; color: #92400e; }
        .badge-low { background: #d1fae5; color: #065f46; }
        .rec-action { font-weight: 600; font-size: 15px; color: #1e293b; margin-bottom: 4px; }
        .rec-reason { font-size: 13px; color: #64748b; line-height: 1.5; }
        
        @media(max-width: 1024px) {
          .split-layout { grid-template-columns: 1fr; }
          .help-side { position: relative; max-height: none; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <div className="title">🔬 Hepatitis AI Prediction System</div>
          <div className="subtitle">Smart liver health assessment using basic lab tests</div>
        </div>

        <div className="split-layout">
          {/* LEFT SIDE - FORM */}
          <div className="form-side">
            <div className="section-title">📋 Basic Liver Function Tests</div>
            <div className="section-subtitle">Enter values from your recent blood report (LFT)</div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Age (years)</label>
                <input type="number" name="Age" className="form-input" value={binaryData.Age} onChange={handleBinaryChange} placeholder="e.g., 35" min="0" max="120" />
              </div>
              <div className="form-group">
                <label className="form-label">Bilirubin (mg/dL)</label>
                <input type="number" step="0.1" name="Bilirubin" className="form-input" value={binaryData.Bilirubin} onChange={handleBinaryChange} placeholder="Normal: 0.1-1.2" min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Alkaline Phosphatase (U/L)</label>
                <input type="number" name="AlkPhosphate" className="form-input" value={binaryData.AlkPhosphate} onChange={handleBinaryChange} placeholder="Normal: 44-147" min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">SGOT/AST (U/L)</label>
                <input type="number" name="Sgot" className="form-input" value={binaryData.Sgot} onChange={handleBinaryChange} placeholder="Normal: 10-40" min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Albumin (g/dL)</label>
                <input type="number" step="0.1" name="Albumin" className="form-input" value={binaryData.Albumin} onChange={handleBinaryChange} placeholder="Normal: 3.5-5.5" min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Prothrombin Time (%)</label>
                <input type="number" name="Protime" className="form-input" value={binaryData.Protime} onChange={handleBinaryChange} placeholder="Normal: 70-130" min="0" max="200" />
              </div>
            </div>

            <div className="section-subtitle" style={{marginTop: '20px', marginBottom: '12px'}}>Current Symptoms</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Fatigue (Tiredness)</label>
                <div className="radio-group">
                  <label className="radio-label"><input type="radio" name="Fatigue" value="0" checked={binaryData.Fatigue === "0"} onChange={handleBinaryChange} /> No</label>
                  <label className="radio-label"><input type="radio" name="Fatigue" value="1" checked={binaryData.Fatigue === "1"} onChange={handleBinaryChange} /> Yes</label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Malaise (Weakness)</label>
                <div className="radio-group">
                  <label className="radio-label"><input type="radio" name="Malaise" value="0" checked={binaryData.Malaise === "0"} onChange={handleBinaryChange} /> No</label>
                  <label className="radio-label"><input type="radio" name="Malaise" value="1" checked={binaryData.Malaise === "1"} onChange={handleBinaryChange} /> Yes</label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Anorexia (Loss of Appetite)</label>
                <div className="radio-group">
                  <label className="radio-label"><input type="radio" name="Anorexia" value="0" checked={binaryData.Anorexia === "0"} onChange={handleBinaryChange} /> No</label>
                  <label className="radio-label"><input type="radio" name="Anorexia" value="1" checked={binaryData.Anorexia === "1"} onChange={handleBinaryChange} /> Yes</label>
                </div>
              </div>
            </div>

            <div className="section-title" style={{marginTop: '30px'}}>🧬 Risk Factors & History</div>
            <div className="section-subtitle">These help predict which type without expensive viral tests</div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Contaminated Food/Water Exposure?</label>
                <select name="Contaminated_Food_Water" className="form-select" value={multiData.Contaminated_Food_Water} onChange={handleMultiChange}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Transfusion/Needle Exposure?</label>
                <select name="Unsafe_Blood_Exposure" className="form-select" value={multiData.Unsafe_Blood_Exposure} onChange={handleMultiChange}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Unprotected Sexual Contact?</label>
                <select name="Sexual_Exposure" className="form-select" value={multiData.Sexual_Exposure} onChange={handleMultiChange}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">IV Drug Use?</label>
                <select name="IV_Drug_Use" className="form-select" value={multiData.IV_Drug_Use} onChange={handleMultiChange}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Symptom Duration (Months)</label>
                <input type="number" name="Infection_Duration_Months" className="form-input" value={multiData.Infection_Duration_Months} onChange={handleMultiChange} placeholder="0 if no symptoms" min="0" max="120" />
              </div>
              <div className="form-group">
                <label className="form-label">Acute or Chronic?</label>
                <select name="Acute_or_Chronic" className="form-select" value={multiData.Acute_or_Chronic} onChange={handleMultiChange}>
                  <option value="0">Acute (Less than 6 months)</option>
                  <option value="1">Chronic (More than 6 months)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Hepatitis A Vaccinated?</label>
                <select name="HepA_Vaccinated" className="form-select" value={multiData.HepA_Vaccinated} onChange={handleMultiChange}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Hepatitis B Vaccinated?</label>
                <select name="HepB_Vaccinated" className="form-select" value={multiData.HepB_Vaccinated} onChange={handleMultiChange}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            <button className="btn" onClick={handlePredict} disabled={loading}>
              {loading ? "🔄 Analyzing..." : "Predict"}
            </button>

            {error && <div className="error">⚠️ {error}</div>}
          </div>

          {/* RIGHT SIDE - HELP */}
          <div className="help-side">
            <div className="help-header">💡 Understanding Your Tests</div>
            
            <div className="help-item">
              <div className="help-item-title">Bilirubin</div>
              <div className="help-item-text">Yellow pigment from broken red blood cells. High levels cause jaundice (yellow skin/eyes).</div>
            </div>

            <div className="help-item">
              <div className="help-item-title">Alkaline Phosphatase</div>
              <div className="help-item-text">Enzyme in liver and bones. Elevated levels indicate liver or bile duct problems.</div>
            </div>

            <div className="help-item">
              <div className="help-item-title">SGOT/AST</div>
              <div className="help-item-text">Liver enzyme. High levels mean liver cells are damaged or dying.</div>
            </div>

            <div className="help-item">
              <div className="help-item-title">Albumin</div>
              <div className="help-item-text">Protein made by liver. Low levels indicate poor liver function.</div>
            </div>

            <div className="help-item">
              <div className="help-item-title">Prothrombin Time</div>
              <div className="help-item-text">Blood clotting speed. Liver makes clotting factors, so poor liver = slow clotting.</div>
            </div>

          </div>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div className="result-card">
            <div className="result-header" style={{
              background: result.hepatitis_detected 
                ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' 
                : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: 'white'
            }}>
              <div className="result-icon">{result.hepatitis_detected ? '⚠️' : '✅'}</div>
              <div className="result-title">
                {result.hepatitis_detected ? 'Hepatitis Detected' : 'Good News! No Hepatitis Detected'}
              </div>
              <div className="result-subtitle">
                {result.hepatitis_detected 
                  ? `Risk Level: ${result.risk_category}`
                  : 'Your liver function tests look normal'}
              </div>
              {result.hepatitis_type && result.hepatitis_type !== "Inconclusive" && (
                <div className="result-type">Predicted Type: Hepatitis {result.hepatitis_type}</div>
              )}
            </div>

            <div className="metrics">
              <div className="metric">
                <div className="metric-label">AI Confidence</div>
                <div className="metric-value">{(result.confidence * 100).toFixed(1)}%</div>
              </div>
              {result.type_confidence && (
                <div className="metric">
                  <div className="metric-label">Type Accuracy</div>
                  <div className="metric-value">{(result.type_confidence * 100).toFixed(1)}%</div>
                </div>
              )}
              <div className="metric">
                <div className="metric-label">Healthy Probability</div>
                <div className="metric-value">{(result.probabilities.negative * 100).toFixed(1)}%</div>
              </div>
              <div className="metric">
                <div className="metric-label">Hepatitis Probability</div>
                <div className="metric-value">{(result.probabilities.positive * 100).toFixed(1)}%</div>
              </div>
            </div>

            <div className="recommendations">
              <div className="rec-title">📋 Recommended Next Steps</div>
              
              {result.hepatitis_detected && result.hepatitis_type && result.hepatitis_type !== "Inconclusive" && (
                <div className="rec-item rec-urgent">
                  <span className="rec-badge badge-urgent">💰 COST-SAVING TIP</span>
                  <div className="rec-action">Order only the {
                    result.hepatitis_type === 'B' ? 'HBsAg (Hepatitis B)' : 
                    result.hepatitis_type === 'C' ? 'Anti-HCV (Hepatitis C)' : 
                    result.hepatitis_type === 'A' ? 'Anti-HAV IgM (Hepatitis A)' : 
                    result.hepatitis_type === 'E' ? 'Anti-HEV IgM (Hepatitis E)' :
                    'Hepatitis D'
                  } test (₹1,500-2,500)</div>
                  <div className="rec-reason">
                    Our AI predicts Hepatitis Type {result.hepatitis_type} with {(result.type_confidence * 100).toFixed(0)}% confidence. 
                    Instead of ordering all 4 viral tests (₹6,000-10,000), ask your doctor to order only this one test to confirm. 
                    This saves you ₹4,500-8,500! Even if the prediction is wrong, you'll only need 1-2 tests instead of all 4.
                  </div>
                </div>
              )}
              
              {result.recommendations.map((rec, idx) => (
                <div key={idx} className={`rec-item rec-${rec.priority}`}>
                  <span className={`rec-badge badge-${rec.priority}`}>
                    {rec.priority === 'urgent' ? '🚨 URGENT' : 
                     rec.priority === 'high' ? '⚠️ IMPORTANT' :
                     rec.priority === 'medium' ? '📌 RECOMMENDED' : 
                     '✓ SUGGESTED'}
                  </span>
                  <div className="rec-action">{rec.action}</div>
                  <div className="rec-reason">{rec.reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Prediction;
