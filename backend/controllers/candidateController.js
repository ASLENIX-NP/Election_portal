const Candidate = require("../models/Candidate");

const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate('student', 'fullName')
      .populate('position', 'title');
      
    // Map to match frontend structure for MVP compatibility
    const mapped = candidates.map(c => ({
      id: c._id,
      name: c.student ? c.student.fullName : (c.name || "Unknown"),
      position: c.position ? c.position.title : (c.positionName || "Unknown"),
      grade: c.grade || "10th",
      votes: c.votes,
      color: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
      avatar: (c.student && c.student.fullName ? c.student.fullName : (c.name || '?')).split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      photoUrl: c.photo || ''
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const createCandidate = async (req, res) => {
  try {
    const { studentId, positionId, electionId, name, position, grade, photoUrl } = req.body;
    
    // Support MVP direct data creation without strict references
    const candidate = await Candidate.create({
      student: studentId || null,
      position: positionId || null,
      election: electionId || null,
      name: name,
      positionName: position,
      grade: grade,
      photo: photoUrl || "",
      isApproved: true
    });

    res.status(201).json({
      id: candidate._id,
      name: candidate.name,
      position: candidate.positionName,
      grade: candidate.grade,
      votes: candidate.votes,
      color: '#3b82f6',
      avatar: (candidate.name || "?").substring(0,2).toUpperCase(),
      photoUrl: candidate.photo
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateCandidate = async (req, res) => {
  try {
    const { name, position, grade, photoUrl } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id, 
      { name, positionName: position, grade, photo: photoUrl || "" },
      { new: true }
    );
    if (!candidate) return res.status(404).json({ message: "Not found" });
    
    res.json({
      id: candidate._id,
      name: candidate.name,
      position: candidate.positionName,
      grade: candidate.grade,
      votes: candidate.votes,
      photoUrl: candidate.photo
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getCandidates, createCandidate, updateCandidate, deleteCandidate };
