const Candidate = require("../models/Candidate");

const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate('student', 'fullName')
      .populate('position', 'title');
      
    // Map to match frontend structure for MVP compatibility
    const mapped = candidates.map(c => ({
      id: c._id,
      name: c.student ? c.student.fullName : "Unknown",
      position: c.position ? c.position.title : "Unknown",
      votes: c.votes,
      color: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
      avatar: c.student && c.student.fullName ? c.student.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const createCandidate = async (req, res) => {
  try {
    const { studentId, positionId, electionId } = req.body;
    
    // Validate that student, position, election exist in a real scenario
    // For MVP we assume the frontend passes valid IDs (or we adjust frontend to pass them)
    // The previous frontend was passing simple strings. We will update the frontend shortly.

    const candidate = await Candidate.create({
      student: studentId,
      position: positionId,
      election: electionId,
      isApproved: true
    });
    
    await candidate.populate('student', 'fullName');
    await candidate.populate('position', 'title');

    res.status(201).json({
      id: candidate._id,
      name: candidate.student.fullName,
      position: candidate.position.title,
      votes: candidate.votes,
      color: '#3b82f6',
      avatar: candidate.student.fullName.substring(0,2).toUpperCase()
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getCandidates, createCandidate };
