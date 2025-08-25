// models/challenge.js
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,           // "Easy" | "Medium" | "Hard"
  category: String,             // e.g., "Network", "Disk", etc.
  image: String,                // path under /public/images or URL
  flag: String,                 // keep server-side only
  solutionSteps: [String],
  points: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
