# 🔬 Hepatitis AI Prediction System

Smart liver health assessment using basic lab tests to predict hepatitis type and save costs.

## 💡 Project Value

**The Problem:** When patients have liver problems, doctors typically order ALL 4 viral marker tests (Hep A, B, C, E) costing ₹6,000-10,000 and taking 5-7 days.

**Our Solution:** 
- Patient gets basic liver function tests (₹300-500)
- Our AI predicts which specific hepatitis type is most likely
- Doctor orders ONLY that one confirmatory viral test (₹1,500-2,500)
- **Result: Save ₹4,500-8,500 per patient and get faster diagnosis!**

## 🎯 Model Accuracy

- **Binary Model** (Hepatitis Yes/No): 94.33% accuracy
- **Multiclass Model** (Type A/B/C/D/E): 75.67% accuracy

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** with Flask, scikit-learn, pandas, numpy
- **Node.js 14+** with npm
- **MongoDB** running locally or connection string

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install ML Service Dependencies**
```bash
cd ml-service
pip install -r requirements.txt
```

### Running the Application

**Option 1: Run all services separately**

Terminal 1 - ML Service (Port 5001):
```bash
cd ml-service
py app.py
```

Terminal 2 - Backend (Port 5000):
```bash
cd backend
npm start
```

Terminal 3 - Frontend (Port 3000):
```bash
cd frontend
npm start
```

**Option 2: Quick start (Windows)**
```bash
# Start all services at once
start cmd /k "cd ml-service && py app.py"
start cmd /k "cd backend && npm start"
start cmd /k "cd frontend && npm start"
```

### Access the Application
Open browser and navigate to: `http://localhost:3000`

## 📋 Sample Test Data

**Test Case 1: Hepatitis B (High Risk)**
- Age: 45
- Bilirubin: 2.5
- Alkaline Phosphatase: 180
- SGOT/AST: 120
- Albumin: 3.2
- Prothrombin Time: 65
- Symptoms: Fatigue (Yes), Malaise (Yes), Anorexia (No)
- Risk Factors: Blood Transfusion (Yes), HepB Vaccinated (No)

**Test Case 2: No Hepatitis (Low Risk)**
- Age: 30
- Bilirubin: 0.8
- Alkaline Phosphatase: 85
- SGOT/AST: 25
- Albumin: 4.5
- Prothrombin Time: 95
- Symptoms: All No
- Risk Factors: All No, Both Vaccinated (Yes)

## 🔧 Retrain Models (Optional)

If you update the datasets, retrain the models:
```bash
cd ml-service
py train_model.py
```

This will regenerate all 4 model files in `ml-service/models/`:
- `best_binary_model.pkl`
- `best_multiclass_model.pkl`
- `binary_features.pkl`
- `multiclass_features.pkl`

## 📁 Project Structure

```
├── backend/              # Express.js API server
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── utils/           # WhatsApp service
├── frontend/            # React UI
│   └── src/            # React components
├── ml-service/          # Python Flask ML service
│   ├── data/           # Training datasets
│   ├── models/         # Trained ML models (required!)
│   ├── app.py          # Flask API
│   └── train_model.py  # Model training script
└── TEST_CASES.md       # Sample test data

```

## ⚙️ Environment Setup

### Backend (.env)
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/hepatitisDB
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=+14474744953
TWILIO_WHATSAPP=whatsapp:+14155238886
ML_SERVICE_URL=http://localhost:5001
```

**Important Notes:**
- Phone numbers in database should be in format: `9494165651` (10 digits for India) or with country code `+919494165651`
- The system automatically adds +91 for 10-digit Indian numbers
- For other countries, include the country code

### ML Service
No environment variables needed. Runs on port 5001 by default.

## 🩺 Features

1. **Cost-Effective Prediction**: Predict hepatitis type from basic LFT tests
2. **High Accuracy**: 94% for detection, 76% for type classification
3. **WhatsApp Notifications**: Automatic result notifications via Twilio
4. **Medicine Reminders**: Track and get reminders for medications
5. **User-Friendly UI**: Split-screen design with helpful explanations

## 🔬 How It Works

1. User enters basic liver function test values (Age, Bilirubin, SGOT, etc.)
2. Binary model predicts if hepatitis is present (94% accuracy)
3. If detected, multiclass model identifies the type A/B/C/D/E (76% accuracy)
4. System recommends ordering only the specific confirmatory test needed
5. Patient saves ₹4,500-8,500 by avoiding unnecessary tests

## 📱 WhatsApp Integration

### Setup WhatsApp Notifications

1. **Get Twilio Account**
   - Sign up at [twilio.com](https://www.twilio.com)
   - Get your Account SID and Auth Token
   - Go to Twilio Console > Messaging > Try it out > Send a WhatsApp message

2. **Join Twilio Sandbox**
   - Send `join [your-sandbox-code]` to +1 415 523 8886 on WhatsApp
   - Example: `join height-rock`
   - You'll receive confirmation: "You are all set!"

3. **Configure Backend**
   - Add your Twilio credentials to `backend/.env`
   - Make sure user phone number is saved in database

4. **Test Notifications**
   - Login to the app
   - Make a prediction
   - Check WhatsApp for result notification
   - Add a medicine reminder to test scheduled notifications

### Notification Types

1. **Prediction Results** - Sent immediately after prediction
2. **Medicine Reminders** - Sent at scheduled time (checked every minute)
3. **Medicine Added** - Confirmation when medicine is added

## 🛠️ Troubleshooting

**ML Service Error:**
- Make sure Python Flask is running on port 5001
- Check that all 4 .pkl files exist in `ml-service/models/`
- Install required packages: `pip install -r requirements.txt`
- Check Python version: `python --version` (needs 3.8+)

**Backend Error:**
- Verify MongoDB is running: `mongosh` or check MongoDB Compass
- Check MongoDB connection string in `.env`
- Ensure port 5000 is not in use
- Run `npm install` in backend folder

**Frontend Error:**
- Ensure backend is running on port 5000
- Clear browser cache and reload
- Run `npm install` in frontend folder
- Check console for errors (F12)

**WhatsApp Not Working:**
- Verify you joined Twilio sandbox (send "join [code]" to +1 415 523 8886)
- Check user has phone number in database
- Phone format: 10 digits (9494165651) or with country code (+919494165651)
- Check backend logs for WhatsApp errors
- Verify Twilio credentials in `.env`

## 📊 Input Validation

All numeric fields have validation:
- Age: 0-120 years
- Bilirubin: ≥ 0 mg/dL
- Alkaline Phosphatase: ≥ 0 U/L
- SGOT/AST: ≥ 0 U/L
- Albumin: ≥ 0 g/dL
- Prothrombin Time: 0-200%
- Symptom Duration: 0-120 months

## 🎓 Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js, MongoDB
- **ML Service**: Python, Flask, scikit-learn, SHAP
- **Notifications**: Twilio WhatsApp API

## 📝 License

Educational project for hepatitis prediction and cost optimization.
