const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  category: String,
  image: String,
  flag: String,
  solutionSteps: [String]
});

module.exports = mongoose.model('Challenge', challengeSchema);
