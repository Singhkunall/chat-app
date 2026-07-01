import SOSAlert from "../models/SOSAlert.js";
import TrustedContact from "../models/TrustedContact.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";
import { sendSOSEmail } from "../lib/sendSOSEmail.js";

// trigger an SOS alert
export const triggerSOS = async (req, res) => {
  try {
    const { lat, lng, message } = req.body;
    const senderId = req.user._id;

    if (!lat || !lng) {
      return res.json({ success: false, message: "Location is required" });
    }

    const alert = await SOSAlert.create({
      senderId,
      location: { lat, lng },
      message: message || undefined
    });

    // notify trusted contacts who are registered users, via socket if online
    const contacts = await TrustedContact.find({ userId: senderId });

    const payload = {
      alertId: alert._id,
      senderId,
      senderName: req.user.fullName,
      location: { lat, lng },
      message: alert.message,
      createdAt: alert.createdAt
    };

    // find matching User accounts for trusted contacts by email, notify if online
    for (const contact of contacts) {
      const contactUser = await User.findOne({ email: contact.email });
      if (contactUser) {
        const socketId = userSocketMap[contactUser._id];
        if (socketId) {
          io.to(socketId).emit("sosAlert", payload);
        }
      }
      // always send an email too, since SOS shouldn't depend on being online
      sendSOSEmail(contact.email, req.user.fullName, lat, lng).catch(err =>
        console.error("SOS email failed:", err.message)
      );
    }

    res.json({ success: true, alert: payload });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// resolve an SOS alert (mark safe)
export const resolveSOS = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await SOSAlert.findOneAndUpdate(
      { _id: id, senderId: req.user._id },
      { status: "resolved" },
      { new: true }
    );
    if (!alert) {
      return res.json({ success: false, message: "Alert not found" });
    }
    res.json({ success: true, alert });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};