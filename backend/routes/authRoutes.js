const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { 
  loginAdmin, 
  loginModerator,
  registerAdmin,
  registerModerator,
  forgotPasswordAdmin,
  resetPasswordAdmin,
  forgotPasswordMod,
  resetPasswordMod
} = require("../controllers/authController");

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const loginValidation = [
  body("username").notEmpty().withMessage("Username is required").trim().escape(),
  body("password").notEmpty().withMessage("Password is required")
];

const signupValidation = [
  body("fullName").notEmpty().withMessage("Full Name is required").trim().escape(),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("username").notEmpty().withMessage("Username is required").trim().escape(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
];

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail()
];

const resetPasswordValidation = [
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
];

router.post("/admin/login", loginValidation, validate, loginAdmin);
router.post("/admin/signup", signupValidation, validate, registerAdmin);
router.post("/admin/forgot-password", forgotPasswordValidation, validate, forgotPasswordAdmin);
router.post("/admin/reset-password/:token", resetPasswordValidation, validate, resetPasswordAdmin);

router.post("/mod/login", loginValidation, validate, loginModerator);
router.post("/mod/signup", signupValidation, validate, registerModerator);
router.post("/mod/forgot-password", forgotPasswordValidation, validate, forgotPasswordMod);
router.post("/mod/reset-password/:token", resetPasswordValidation, validate, resetPasswordMod);

module.exports = router;
