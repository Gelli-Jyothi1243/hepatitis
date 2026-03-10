const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");
const sendWhatsApp = require("../utils/whatsappService");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

console.log("✅ Prediction routes loaded");

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Prediction route works!" });
});

// Health check
router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`);
    res.json(response.data);
  } catch (error) {
    res.status(503).json({ error: "ML service unavailable" });
  }
});

// Predict
router.post("/predict", async (req, res) => {
  console.log("📥 Prediction request received");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
  console.log("📊 Body keys:", Object.keys(req.body));
  
  try {
    console.log(`🔗 Forwarding to ML service: ${ML_SERVICE_URL}/predict`);
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("✅ ML service responded successfully");
    
    const result = response.data;
    
    // Send WhatsApp notification if userId is provided
    console.log("🔍 Checking WhatsApp notification...");
    console.log("📋 userId from request:", req.body.userId);
    
    if (req.body.userId) {
      try {
        console.log("🔎 Looking up user in database...");
        const user = await User.findById(req.body.userId);
        
        if (!user) {
          console.log("❌ User not found in database!");
        } else {
          console.log("✅ User found:", user.name, user.email);
          console.log("📞 User phone:", user.phone);
          
          if (!user.phone) {
            console.log("❌ User has no phone number saved!");
          } else {
            console.log("✅ User has phone number, preparing message...");
            
            let message = `🔬 Hepatitis Health Check Results\n\n`;
            
            if (result.hepatitis_detected) {
              message += `⚠️ Status: Hepatitis Detected\n`;
              message += `📊 Risk Level: ${result.risk_category}\n`;
              if (result.hepatitis_type) {
                message += `🧬 Type: Hepatitis ${result.hepatitis_type}\n`;
              }
              message += `✅ Confidence: ${(result.confidence * 100).toFixed(1)}%\n\n`;
              
              // Add urgent recommendations
              const urgentRecs = result.recommendations.filter(r => r.priority === 'urgent' || r.priority === 'high');
              if (urgentRecs.length > 0) {
                message += `⚠️ IMPORTANT ACTIONS:\n`;
                urgentRecs.forEach((rec, idx) => {
                  message += `${idx + 1}. ${rec.action}\n`;
                });
              }
            } else {
              message += `✅ Status: No Hepatitis Detected\n`;
              message += `📊 Risk Level: ${result.risk_category}\n`;
              message += `✅ Confidence: ${(result.confidence * 100).toFixed(1)}%\n\n`;
              message += `Keep maintaining a healthy lifestyle!\n`;
            }
            
            message += `\n📱 Check your dashboard for detailed results and recommendations.`;
            
            console.log("📤 Attempting to send WhatsApp...");
            await sendWhatsApp(user.phone, message);
            console.log(`✅ WhatsApp notification sent successfully to ${user.phone}`);
          }
        }
      } catch (whatsappError) {
        console.error("❌ WhatsApp notification failed:", whatsappError.message);
        console.error("❌ Full error:", whatsappError);
        // Don't fail the request if WhatsApp fails
      }
    } else {
      console.log("⚠️ No userId provided in request - skipping WhatsApp notification");
    }
    
    res.json(result);
  } catch (error) {
    console.error("❌ Prediction error:", error.message);
    if (error.response) {
      console.error("❌ ML service error response:", error.response.data);
      res.status(error.response.status).json({ 
        error: "ML service error",
        message: error.response.data.error || error.response.data.message || error.message 
      });
    } else {
      console.error("❌ Network error:", error.message);
      res.status(500).json({ 
        error: "Prediction failed",
        message: "Could not connect to ML service. Make sure it's running on port 5001." 
      });
    }
  }
});

module.exports = router;
