const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");
const User = require("../models/User");
const sendWhatsApp = require("../utils/whatsappService");


// 🔹 ADD MEDICINE
router.post("/add-medicine", async (req, res) => {
  try {
    const { userId, name, time, startDate, endDate } = req.body;

    const medicine = new Medicine({
      userId,
      name,
      time,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    });

    await medicine.save();
    console.log(`✅ Medicine saved to database: ${name} at ${time}`);

    const user = await User.findById(userId);

    if (user && user.phone) {
      await sendWhatsApp(
        user.phone,
        `💊 Medicine Added Successfully\n\n${name}\nTime: ${time}\nYou will receive reminder at scheduled time.`
      );
    }

    res.status(201).json(medicine);

  } catch (error) {
    console.error("❌ Add Medicine Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});


// 🔹 GET MEDICINES
router.get("/get-medicines/:userId", async (req, res) => {
  try {
    const medicines = await Medicine.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    console.log(`✅ Found ${medicines.length} medicines for user ${req.params.userId}`);
    if (medicines.length > 0) {
      console.log("📋 Medicines:", medicines.map(m => `${m.name} at ${m.time}`).join(", "));
    }

    res.json(medicines);

  } catch (error) {
    console.error("❌ Get medicines error:", error.message);
    res.status(500).json({ message: error.message });
  }
});


// 🔹 DELETE MEDICINE
router.delete("/delete-medicine/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (medicine) {
      console.log(`🗑️ Deleting medicine: ${medicine.name}`);
      await Medicine.findByIdAndDelete(req.params.id);
      res.json({ message: "Medicine deleted successfully" });
    } else {
      res.status(404).json({ message: "Medicine not found" });
    }
  } catch (error) {
    console.error("❌ Delete medicine error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;