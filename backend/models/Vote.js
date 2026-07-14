const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
      required: true,
    },

    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },

    votedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vote", voteSchema);96