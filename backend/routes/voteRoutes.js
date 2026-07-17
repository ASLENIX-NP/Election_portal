const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { castVote } = require("../controllers/voteController");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const voteValidation = [
  body("studentId").notEmpty().withMessage("Student ID is required").isString().trim().escape(),
  body("candidateIds").isArray({ min: 1 }).withMessage("At least one candidate ID must be provided"),
  body("candidateIds.*").isMongoId().withMessage("Invalid candidate ID format")
];

router.post("/cast", voteValidation, validate, castVote);

module.exports = router;
