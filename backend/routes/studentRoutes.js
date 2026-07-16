const express = require("express");
const router = express.Router();
const { getStudents, generateCredentials } = require("../controllers/studentController");

router.get("/", getStudents);
router.post("/generate-passes", generateCredentials);

module.exports = router;
