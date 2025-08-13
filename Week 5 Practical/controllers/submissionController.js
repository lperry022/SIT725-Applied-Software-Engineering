const {
  getChallengeById,
  verifyFlag
} = require('../models/challengeModel');

const {
  recordSubmission,
  getScoreboard
} = require('../models/submissionModel');

// POST /submit/:id
exports.handleSubmitFlag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submittedFlag = (req.body.flag || '').trim();

    const isCorrect = await verifyFlag(id, submittedFlag);
    // Record the attempt (replace 'guest' with your auth user when ready)
    await recordSubmission({ user: 'guest', challengeId: String(id), correct: isCorrect });

    const challenge = await getChallengeById(id);
    const title = challenge?.title || `Challenge #${id}`;

    res.render('submissionResult', {
      ok: isCorrect,
      challengeTitle: title,
      submittedFlag
    });
  } catch (err) {
    next(err);
  }
};

// GET /scoreboard
exports.renderScoreboard = async (_req, res, next) => {
  try {
    const rows = await getScoreboard();
    res.render('scoreboard', { rows });
  } catch (err) {
    next(err);
  }
};