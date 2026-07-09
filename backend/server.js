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

// Test Route
app.get("/", (req, res) => {
  res.send("School Election API Running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});