const Admin = require("../models/Admin");
const Moderator = require("../models/Moderator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "default_jwt_secret_key_123", {
    expiresIn: "30d",
  });
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id, admin.role),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during admin login", error: error.message });
  }
};

// @desc    Moderator login
// @route   POST /api/auth/mod/login
// @access  Public
const loginModerator = async (req, res) => {
  try {
    const { username, password } = req.body;

    const mod = await Moderator.findOne({ username });

    if (mod && (await bcrypt.compare(password, mod.password))) {
      res.json({
        _id: mod._id,
        username: mod.username,
        fullName: mod.fullName,
        email: mod.email,
        role: mod.role,
        token: generateToken(mod._id, mod.role),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during moderator login", error: error.message });
  }
};

module.exports = {
  loginAdmin,
  loginModerator,
};
