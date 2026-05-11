import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profilePic: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    
  },
    isVerified: {
    type: Boolean,
    default: false, // initially false until OTP is verified
  },
  otp: {
    type: String, // store OTP as string (or hashed if needed)
  },
  otpExpiry: {
    type: Date, // store the expiry timestamp for OTP
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
