const Booth = require("../models/Booth");

const getBooths = async (req, res) => {
  try {
    let booths = await Booth.find();
    if (booths.length === 0) {
      // Seed default booths for MVP
      const defaultBooths = [
        { boothId: 'booth-01', name: 'Terminal Alpha', location: 'Main Hall', status: 'idle' },
        { boothId: 'booth-02', name: 'Terminal Beta', location: 'Main Hall', status: 'offline' },
      ];
      await Booth.insertMany(defaultBooths);
      booths = await Booth.find();
    }
    
    const mapped = booths.map(b => ({
      id: b.boothId,
      name: b.name,
      location: b.location,
      status: b.status,
      activeStudentSession: b.activeStudentSession
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const createBooth = async (req, res) => {
  try {
    const { name, location } = req.body;
    const newBooth = await Booth.create({
      boothId: `booth-${Date.now()}`,
      name,
      location,
      status: 'offline'
    });
    res.status(201).json({
      id: newBooth.boothId,
      name: newBooth.name,
      location: newBooth.location,
      status: newBooth.status,
      activeStudentSession: newBooth.activeStudentSession
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteBooth = async (req, res) => {
  try {
    await Booth.findOneAndDelete({ boothId: req.params.id });
    res.json({ message: "Booth deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const authorizeSession = async (req, res) => {
  try {
    const { studentId } = req.body;
    const booth = await Booth.findOneAndUpdate(
      { boothId: req.params.id },
      { activeStudentSession: studentId, status: 'voting' },
      { new: true }
    );
    res.json(booth);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const clearSession = async (req, res) => {
  try {
    const booth = await Booth.findOneAndUpdate(
      { boothId: req.params.id },
      { activeStudentSession: null, status: 'idle' },
      { new: true }
    );
    res.json(booth);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booth = await Booth.findOneAndUpdate(
      { boothId: req.params.id },
      { status },
      { new: true }
    );
    res.json(booth);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getBooths, createBooth, deleteBooth, authorizeSession, clearSession, updateStatus };
