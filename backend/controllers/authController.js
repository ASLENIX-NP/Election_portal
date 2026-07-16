const Admin = require("../models/Admin");
const Moderator = require("../models/Moderator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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
      if (!mod.isApproved) {
        return res.status(403).json({ message: "Account pending admin approval" });
      }
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

// @desc    Register a new Admin
// @route   POST /api/auth/admin/signup
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    const adminExists = await Admin.findOne({ $or: [{ email }, { username }] });
    if (adminExists) {
      return res.status(400).json({ message: "Admin with that username or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      fullName,
      email,
      username,
      password: hashedPassword,
      role: "Admin",
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id, admin.role),
      });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during admin registration", error: error.message });
  }
};

// @desc    Register a new Moderator
// @route   POST /api/auth/mod/signup
// @access  Public
const registerModerator = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    const modExists = await Moderator.findOne({ $or: [{ email }, { username }] });
    if (modExists) {
      return res.status(400).json({ message: "Moderator with that username or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const mod = await Moderator.create({
      fullName,
      email,
      username,
      password: hashedPassword,
      role: "Station Monitor", // Default role
      isApproved: false
    });

    if (mod) {
      res.status(201).json({
        message: "Account created successfully. Pending admin approval.",
        _id: mod._id,
        username: mod.username
      });
    } else {
      res.status(400).json({ message: "Invalid moderator data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during moderator registration", error: error.message });
  }
};

// @desc    Forgot Password for Admin
// @route   POST /api/auth/admin/forgot-password
// @access  Public
const forgotPasswordAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "No admin found with this email" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    admin.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    admin.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await admin.save();

    const resetUrl = `http://localhost:5173/admin/reset-password/${resetToken}`;
    
    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your Admin account.</p>
      <p>Please click the link below to set a new password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        to: admin.email,
        subject: "Admin Password Reset",
        html: message,
      });
      res.json({ message: "Reset link sent to email." });
    } catch (err) {
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpires = undefined;
      await admin.save();
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Reset Password for Admin
// @route   POST /api/auth/admin/reset-password/:token
// @access  Public
const resetPasswordAdmin = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    admin.password = await bcrypt.hash(req.body.password, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Forgot Password for Moderator
// @route   POST /api/auth/mod/forgot-password
// @access  Public
const forgotPasswordMod = async (req, res) => {
  try {
    const { email } = req.body;
    const mod = await Moderator.findOne({ email });
    if (!mod) {
      return res.status(404).json({ message: "No moderator found with this email" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    mod.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    mod.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await mod.save();

    const resetUrl = `http://localhost:5173/mod/reset-password/${resetToken}`;
    
    const message = `
      <h1>Moderator Password Reset</h1>
      <p>You requested a password reset for your Moderator account.</p>
      <p>Please click the link below to set a new password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#8b5cf6;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        to: mod.email,
        subject: "Moderator Password Reset",
        html: message,
      });
      res.json({ message: "Reset link sent to email." });
    } catch (err) {
      mod.resetPasswordToken = undefined;
      mod.resetPasswordExpires = undefined;
      await mod.save();
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Reset Password for Moderator
// @route   POST /api/auth/mod/reset-password/:token
// @access  Public
const resetPasswordMod = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const mod = await Moderator.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!mod) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    mod.password = await bcrypt.hash(req.body.password, 10);
    mod.resetPasswordToken = undefined;
    mod.resetPasswordExpires = undefined;
    await mod.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  loginAdmin,
  loginModerator,
  registerAdmin,
  registerModerator,
  forgotPasswordAdmin,
  resetPasswordAdmin,
  forgotPasswordMod,
  resetPasswordMod
};
