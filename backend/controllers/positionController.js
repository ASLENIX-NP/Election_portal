const Position = require("../models/Position");

const getPositions = async (req, res) => {
  try {
    const positions = await Position.find();
    // Map to match frontend structure for MVP compatibility
    const mapped = positions.map(p => ({
      id: p._id,
      title: p.title,
      maxVotes: p.maxWinners
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const createPosition = async (req, res) => {
  try {
    const { title, maxVotes } = req.body;
    const position = await Position.create({ title, maxWinners: maxVotes || 1 });
    res.status(201).json({
      id: position._id,
      title: position.title,
      maxVotes: position.maxWinners
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getPositions, createPosition };
