const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema(
  {
    boothId: {
      type: String,
      required: true,
      unique: true,
    },
    
    name: {
      type: String,
      required: true,
    },
    
    location: {
      type: String,
      default: "Main Hall",
    },
    
    status: {
      type: String,
      enum: ["offline", "idle", "voting", "maintenance"],
      default: "offline",
    },
    
    activeStudentSession: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booth", boothSchema);
