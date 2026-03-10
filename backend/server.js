const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware - BEFORE routes
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  console.log(`📦 Body:`, req.body);
  next();
});

// Routes
try {
  const authRoutes = require("./routes/auth");
  const medicineRoutes = require("./routes/medicineRoutes");
  const predictionRoutes = require("./routes/prediction");
  
  app.use("/api/auth", authRoutes);
  app.use("/api/medicine", medicineRoutes);
  app.use("/api/prediction", predictionRoutes);
  
  console.log("✅ All routes registered successfully");
} catch (error) {
  console.error("❌ Error loading routes:", error.message);
  console.error(error.stack);
}

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Route not found" });
});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // 🔥 Load scheduler AFTER DB connects
    require("./scheduler");

  })
  .catch((err) => console.log("❌ Mongo Error:", err));

// Start Server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
  console.log("📋 Routes loaded: /api/auth, /api/medicine, /api/prediction");
});