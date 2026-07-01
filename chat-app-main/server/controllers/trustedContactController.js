import TrustedContact from "../models/TrustedContact.js";

export const addContact = async (req, res) => {
  try {
    const { name, email, relation } = req.body;
    if (!name || !email) {
      return res.json({ success: false, message: "Name and email are required" });
    }
    const contact = await TrustedContact.create({
      userId: req.user._id,
      name,
      email,
      relation
    });
    res.json({ success: true, contact });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await TrustedContact.find({ userId: req.user._id });
    res.json({ success: true, contacts });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await TrustedContact.findOneAndDelete({ _id: id, userId: req.user._id });
    res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};