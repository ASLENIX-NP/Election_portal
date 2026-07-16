const express = require("express");
const router = express.Router();
const { getBooths, createBooth, deleteBooth, authorizeSession, clearSession, updateStatus } = require("../controllers/boothController");

router.get("/", getBooths);
router.post("/", createBooth);
router.delete("/:id", deleteBooth);
router.post("/:id/session", authorizeSession);
router.delete("/:id/session", clearSession);
router.put("/:id/status", updateStatus);

module.exports = router;
