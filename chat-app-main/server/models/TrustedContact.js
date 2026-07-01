import mongoose from "mongoose";

const trustedContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  relation: {
    type: String,
  }
}, { timestamps: true });

const TrustedContact = mongoose.model("TrustedContact", trustedContactSchema);

export default TrustedContact;