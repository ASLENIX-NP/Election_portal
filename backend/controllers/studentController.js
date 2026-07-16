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

module.exports = { getStudents, generateCredentials };
