import nodemailer from "nodemailer";

export const sendSOSEmail = async (email, senderName, lat, lng) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

  const mailOptions = {
    from: `"Chat App SOS" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `🚨 Emergency Alert from ${senderName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 2px solid #dc2626; border-radius: 8px;">
        <h2 style="color: #dc2626;">🚨 Emergency Alert</h2>
        <p><strong>${senderName}</strong> has triggered an SOS alert and may need help.</p>
        <p><a href="${mapsLink}" style="color: #2563eb;">📍 View their current location</a></p>
        <p style="color: #555; font-size: 13px;">This is an automated alert from Chat App's safety feature.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};