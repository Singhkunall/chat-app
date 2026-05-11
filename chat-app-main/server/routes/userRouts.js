import express from 'express';
import { checkAuth, login, signup, updateProfile, verifyOTP } from '../controllers/userController.js';
import { protectRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post("/signup",signup);
userRouter.post('/verify-otp', verifyOTP); 
userRouter.post("/login",login);


userRouter.put("/update-profile",protectRoute, updateProfile);
userRouter.get("/check",protectRoute, checkAuth);

// userRouter.post('/signup', signup);            // Step 1 - send OTP
// userRouter.post('/verify-otp', verifyOTP);     // Step 2 - verify OTP and save password


export default userRouter;