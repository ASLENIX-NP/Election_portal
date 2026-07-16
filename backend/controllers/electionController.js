const Election = require("../models/Election");

const getElectionSettings = async (req, res) => {
  try {
    let election = await Election.findOne();
    if (!election) {
      // Create default if missing
      election = await Election.create({
        title: "Student Council Election",
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      });
    }
    res.json({
      title: election.title,
      status: election.status,
      startDate: election.startDate,
      endDate: election.endDate
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateElectionSettings = async (req, res) => {
  try {
    const { title, status } = req.body;
    let election = await Election.findOne();
    if (election) {
      election.title = title || election.title;
      election.status = status || election.status;
      await election.save();
    }
    res.json({ title: election.title, status: election.status });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getElectionSettings, updateElectionSettings };
