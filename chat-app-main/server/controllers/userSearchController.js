import User from "../models/User.js";

// search users by username (partial match)
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.json({ success: true, users: [] });
    }
    const currentUserId = req.user._id;

    const users = await User.find({
      _id: { $ne: currentUserId },
      username: { $regex: query.trim(), $options: "i" }
    }).select("-password").limit(20);

    res.json({ success: true, users });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// get a single user by their exact username (used for invite links / QR)
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() }).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};