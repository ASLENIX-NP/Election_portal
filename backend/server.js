const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/positions", require("./routes/positionRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/votes", require("./routes/voteRoutes"));
app.use("/api/elections", require("./routes/electionRoutes"));
app.use("/api/moderators", require("./routes/moderatorRoutes"));
app.use("/api/booths", require("./routes/boothRoutes"));

// Test Route
app.get("/", (req, res) => {
  res.send("School Election API Running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});