import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// import { sendOTPEmail } from "../lib/sendOTP.js";

// Signup a new user
import crypto from "crypto";
import { sendOTPEmail } from "../lib/sendOTP.js"; // make sure path is correct
import { sendAccountCreatedEmail } from "../lib/sendAccountCreatedEmail.js";

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    // Step 1: Validate input
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Account already exists" });
    }

    // Step 3: Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 4: Generate OTP and expiry
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    // Step 5: Send OTP Email
    await sendOTPEmail(email, otp);

    // Step 6: Create user but not verified
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
      otp,
      otpExpiry,
      isVerified: false,
    });

    // Step 7: Respond
    res.json({
      success: true,
      message: "OTP sent to your email. Please verify to activate your account.",
    });

  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// email veryfy otp
export const verifyOTP = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.password = await bcrypt.hash(password, 10);

    await user.save();
    const token = generateToken(user._id);
    await sendAccountCreatedEmail(user.email, user.fullName);
    res.json({
      success: true,
      token,
      userData: user,
      message: "Account verified and created successfully"
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// controller for user login
export const login = async (req, res) => {
  
  try {
    const { email, password } = req.body;
    
    const userData = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if(!isPasswordCorrect){
        return res.json({
            success: false,
            message: "Invalid password",
        });
    }
    const token = generateToken(userData._id);
    res.json({
      success: true,
      userData,
      token,
      message: "logged in successfully",
    });
    
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message ,
    });
  }
}

//conteroller to check if user is authenticated
export const checkAuth = async (req, res) => {
    res.json({success: true, user: req.user});
}

// controller to update user profile
export const updateProfile = async (req, res) => {
    try {
        const {profilePic ,bio ,fullName} = req.body;
        const userId = req.user._id;
        let updatedUser;
        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {
                fullName,
                bio
            }, { new: true });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser= await User.findByIdAndUpdate(userId, {
                fullName,
                bio,
                profilePic: upload.secure_url
            }, { new: true });
        }
        res.json({
            success: true,
            
            user: updatedUser
        });
    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message,
        });
    }
}