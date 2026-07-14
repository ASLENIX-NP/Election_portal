const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
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

    manifesto: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    symbol: {
      type: String,
      default: "",
    },

    votes: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);