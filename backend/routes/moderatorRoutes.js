const express = require("express");
const router = express.Router();
const { getModerators, createModerator, deleteModerator } = require("../controllers/moderatorController");

router.get("/", getModerators);
router.post("/", createModerator);
router.delete("/:id", deleteModerator);

module.exports = router;
