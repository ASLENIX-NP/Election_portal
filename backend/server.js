const express = require("express");
const cors = require("cors");
const http = require("http");
const helmet = require("helmet");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Setup WebSockets
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected via WebSocket", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate Limiting for critical routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/auth", apiLimiter);
app.use("/api/votes", apiLimiter);

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

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = { app, server };