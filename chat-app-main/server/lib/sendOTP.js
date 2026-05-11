import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `Chat App <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🔐 Your OTP Code for Chat App Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #4A90E2;">Chat App Verification</h2>
          <p>Hi there,</p>
          <p>Use the following One-Time Password (OTP) to complete your verification:</p>
          <h1 style="color: #2E86C1; letter-spacing: 2px;">${otp}</h1>
          <p style="color: #555;">This code is valid for <strong>5 minutes</strong>.</p>
          <p style="color: #B03A2E;"><strong>Do not share this OTP with anyone.</strong> We will never ask for your OTP via phone or email.</p>
          <hr />
          <p style="font-size: 12px; color: #999;">If you didn't request this, you can safely ignore this email or contact our support.</p>
          <p style="font-size: 12px; color: #999;">— Chat App Team</p>
        </div>
      `
    };


    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully");
  } catch (err) {
    console.error("Email error:", err.message);
    throw new Error("Failed to send email");
  }
};
