const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Active", "Completed"],
      default: "Upcoming",
    },

    eligibleGrades: [
      {
        type: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Election", electionSchema);