require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const challengeRoutes = require('./routes/challenges.js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static("public")); // serve frontend files
app.use(express.json());           // parse JSON requests

// Routes
app.use("/api/challenges", challengeRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Start Server
app.listen(port, () => {
  console.log(`🚀 App listening on port ${port}`);
});
app.post('/api/submit-flag', async (req, res) => {
  const { id, flag } = req.body;
  const challenge = await Challenge.findById(id);
  if (!challenge) return res.status(404).json({ correct: false });

  const correct = challenge.flag.trim() === flag.trim();
  res.json({ correct });
});
