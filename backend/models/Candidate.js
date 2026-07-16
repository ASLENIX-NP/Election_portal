const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: false,
    },

    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
      required: false,
    },

    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: false,
    },

    name: {
      type: String,
    },
    
    positionName: {
      type: String,
    },
    
    grade: {
      type: String,
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