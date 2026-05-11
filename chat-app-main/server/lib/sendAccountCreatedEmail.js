// lib/sendAccountCreatedEmail.js
import nodemailer from "nodemailer";

export const sendAccountCreatedEmail = async (email, fullName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or "Yahoo", or use host + port if using SMTP
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Your App Name" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "🎉 Account Created Successfully!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9fafb; border-radius: 8px; padding: 30px; border: 1px solid #e5e7eb;">
        <div style="text-align: center;">
          <h1 style="color: #10b981; margin-bottom: 8px;">🎉 Welcome to Chat App, ${fullName}!</h1>
          <p style="font-size: 16px; color: #374151;">We’re excited to have you on board.</p>
        </div>

        <div style="margin-top: 20px;">
          <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
            Your account has been <strong>successfully created and verified</strong>. You're now part of a growing community of users who value fast, secure, and real-time messaging.
          </p>

          <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
            You can now login to your account, customize your profile, and start chatting instantly with your friends.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://chat-app-lac-seven-49.vercel.app/login" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
              🚀 Login Now
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280;">
            If you have any questions, feel free to reply to this email — we're always here to help!
          </p>
        </div>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;" />

        <p style="text-align: center; font-size: 13px; color: #9ca3af;">
          — The Chat App Team
        </p>
      </div>
    `

  };

  await transporter.sendMail(mailOptions);
};
