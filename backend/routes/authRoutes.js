const express = require("express");
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

router.post("/admin/login", loginAdmin);
router.post("/admin/signup", registerAdmin);
router.post("/admin/forgot-password", forgotPasswordAdmin);
router.post("/admin/reset-password/:token", resetPasswordAdmin);

router.post("/mod/login", loginModerator);
router.post("/mod/signup", registerModerator);
router.post("/mod/forgot-password", forgotPasswordMod);
router.post("/mod/reset-password/:token", resetPasswordMod);

module.exports = router;
