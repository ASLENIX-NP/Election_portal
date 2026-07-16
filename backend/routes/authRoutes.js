const express = require("express");
const router = express.Router();
const { loginAdmin, loginModerator } = require("../controllers/authController");

router.post("/admin/login", loginAdmin);
router.post("/mod/login", loginModerator);

module.exports = router;
