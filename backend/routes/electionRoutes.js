const express = require("express");
const router = express.Router();
const { getElectionSettings, updateElectionSettings } = require("../controllers/electionController");

router.get("/settings", getElectionSettings);
router.put("/settings", updateElectionSettings);

module.exports = router;
