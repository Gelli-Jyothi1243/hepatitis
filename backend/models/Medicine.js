const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  startDate: Date,
  endDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Medicine", medicineSchema);