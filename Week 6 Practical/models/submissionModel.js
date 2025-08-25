// models/submissionModel.js
const mongoose = require('mongoose');
const Challenge = require('./Challenge');

const submissionSchema = new mongoose.Schema({
  user: { type: String, required: true },           // replace with ObjectId later if you add real users
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  correct: { type: Boolean, default: false },
  submittedFlag: { type: String, default: '' },     // optional auditing; consider hashing if sensitive
  awardedPoints: { type: Number, default: 0 },      // snapshot points when correct
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);

// Record an attempt
async function recordSubmission({ user, challengeId, correct, submittedFlag = '' }) {
  // If correct, pull challenge points once and snapshot
  let awardedPoints = 0;
  if (correct) {
    const ch = await Challenge.findById(challengeId, { points: 1 }).lean();
    awardedPoints = ch?.points || 0;
  }

  const rec = await Submission.create({
    user,
    challengeId,
    correct,
    submittedFlag,
    awardedPoints,
  });
  return rec.toObject();
}

// Scoreboard: total points per user, then recent 20 attempts
async function getScoreboard(limit = 20) {
  const scores = await Submission.aggregate([
    { $match: { correct: true } },
    { $group: { _id: '$user', totalPoints: { $sum: '$awardedPoints' } } },
    { $sort: { totalPoints: -1, _id: 1 } },
  ]);

  const recent = await Submission.find({})
    .populate('challengeId', 'title')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return { scores, recent };
}

module.exports = {
  Submission,
  recordSubmission,
  getScoreboard,
};
