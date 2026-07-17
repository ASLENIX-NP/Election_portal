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

const updatePosition = async (req, res) => {
  try {
    const { title, maxVotes } = req.body;
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      { title, maxWinners: maxVotes },
      { new: true }
    );
    if (!position) return res.status(404).json({ message: "Position not found" });
    res.json({
      id: position._id,
      title: position.title,
      maxVotes: position.maxWinners
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deletePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);
    if (!position) return res.status(404).json({ message: "Position not found" });
    res.json({ message: "Position deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getPositions, createPosition, updatePosition, deletePosition };
