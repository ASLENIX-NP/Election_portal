const Student = require("../models/Student");

const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ role: 'student' }).sort({ rollNumber: 1 });
    
    // Map to match frontend structure for MVP compatibility
    const mapped = students.map(s => ({
      id: s.studentId,
      name: s.fullName,
      grade: s.grade + "th", // simple mapping for grade display
      status: s.hasVoted ? 'voted' : 'eligible',
      credential: s.password // Temporary mapping for MVP
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const generateCredentials = async (req, res) => {
  // In a real scenario, this would regenerate hashes and update DB.
  // For MVP compatibility, we just fetch them since they already have passwords.
  res.json({ message: "Credentials are pre-generated via seeder for MVP." });
};

const createStudent = async (req, res) => {
  try {
    const { id, name, grade } = req.body;
    // Map to the schema fields
    const newStudent = await Student.create({
      studentId: id,
      fullName: name,
      grade: parseInt(grade) || 10,
      gender: "Not Specified", // Default required fields
      dob: new Date("2010-01-01"),
      section: "A",
      password: "pass" + Math.floor(Math.random() * 10000), // Default credential
      role: 'student',
      hasVoted: false
    });
    
    res.status(201).json({
      id: newStudent.studentId,
      name: newStudent.fullName,
      grade: newStudent.grade + "th",
      status: 'eligible',
      credential: newStudent.password
    });
  } catch (error) {
    if (error.code === 11000) {
       return res.status(400).json({ message: "Student ID already exists" });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ studentId: req.params.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const bulkCreateStudents = async (req, res) => {
  try {
    const { students } = req.body;
    if (!students || !Array.isArray(students)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const studentsToInsert = students.map(s => ({
      studentId: s.id,
      fullName: s.name,
      grade: parseInt(s.grade) || 10,
      gender: "Not Specified",
      dob: new Date("2010-01-01"),
      section: "A",
      password: "pass" + Math.floor(Math.random() * 10000),
      role: 'student',
      hasVoted: false
    }));

    // Ignore duplicates based on studentId
    await Student.insertMany(studentsToInsert, { ordered: false }).catch(err => {
      // Ignore duplicate key errors for bulk inserts
      if (err.code !== 11000) throw err;
    });

    res.status(201).json({ message: "Bulk import processed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getStudents, generateCredentials, createStudent, deleteStudent, bulkCreateStudents };
