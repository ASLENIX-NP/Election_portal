const express = require("express");
const router = express.Router();
const { getModerators, createModerator, deleteModerator, approveModerator } = require("../controllers/moderatorController");

router.get("/", getModerators);
router.post("/", createModerator);
router.put("/:id/approve", approveModerator);
router.delete("/:id", deleteModerator);

module.exports = router;
