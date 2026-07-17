const express = require("express");
const router = express.Router();
const { getStudents, generateCredentials, createStudent, deleteStudent, bulkCreateStudents } = require("../controllers/studentController");

router.get("/", getStudents);
router.post("/", createStudent);
router.post("/bulk", bulkCreateStudents);
router.delete("/:id", deleteStudent);
router.post("/generate-passes", generateCredentials);

module.exports = router;
