const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const Student = require("../models/Student");

const castVote = async (req, res) => {
  try {
    const { candidateIds, studentId } = req.body;
    
    // Validate student
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: "Voter not found" });
    if (student.hasVoted) return res.status(400).json({ message: "Voter has already cast a ballot" });

    // Record votes and increment candidate counts
    for (const cid of candidateIds) {
      await Candidate.findByIdAndUpdate(cid, { $inc: { votes: 1 } });
    }

    // Mark student as voted
    student.hasVoted = true;
    await student.save();

    // In a full implementation, create a secure Vote record here for audit
    // await Vote.create({ student: student._id, candidates: candidateIds, ... })

    // Emit real-time update
    const io = req.app.get("io");
    if (io) {
      io.emit("newVote", { studentId, timestamp: new Date() });
    }

    res.status(200).json({ message: "Vote cast successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { castVote };
