const express = require("express");
const router = express.Router();
const { getCandidates, createCandidate, updateCandidate, deleteCandidate } = require("../controllers/candidateController");

router.get("/", getCandidates);
router.post("/", createCandidate);
router.put("/:id", updateCandidate);
router.delete("/:id", deleteCandidate);

module.exports = router;
