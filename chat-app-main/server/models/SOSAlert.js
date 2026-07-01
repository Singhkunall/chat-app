import mongoose from "mongoose";

const sosAlertSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  message: {
    type: String,
    default: "I need help. This is an emergency."
  },
  status: {
    type: String,
    enum: ["active", "resolved"],
    default: "active"
  }
}, { timestamps: true });

const SOSAlert = mongoose.model("SOSAlert", sosAlertSchema);

export default SOSAlert;