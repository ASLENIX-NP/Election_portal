const Moderator = require("../models/Moderator");
const bcrypt = require("bcryptjs");

const getModerators = async (req, res) => {
  try {
    const moderators = await Moderator.find().select("-password");
    // Map to MVP frontend structure
    const mapped = moderators.map(m => ({
      id: m._id,
      name: m.fullName,
      email: m.email,
      role: m.role,
      isApproved: m.isApproved,
      avatar: m.fullName.substring(0, 2).toUpperCase(),
      color: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'][Math.floor(Math.random() * 6)]
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const createModerator = async (req, res) => {
  try {
    const { name, email, username, role, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || "mod123", salt);
    
    const mod = await Moderator.create({
      fullName: name,
      email,
      username: username || email.split("@")[0],
      password: hashedPassword,
      role: role || "moderator"
    });
    
    res.status(201).json({
      id: mod._id,
      name: mod.fullName,
      email: mod.email,
      role: mod.role,
      isApproved: mod.isApproved,
      avatar: mod.fullName.substring(0, 2).toUpperCase(),
      color: '#3b82f6'
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteModerator = async (req, res) => {
  try {
    await Moderator.findByIdAndDelete(req.params.id);
    res.json({ message: "Moderator removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const approveModerator = async (req, res) => {
  try {
    const mod = await Moderator.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!mod) return res.status(404).json({ message: "Moderator not found" });
    res.json({ message: "Moderator approved", id: mod._id, isApproved: mod.isApproved });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getModerators, createModerator, deleteModerator, approveModerator };
