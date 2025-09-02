const { getAllChallenges, getChallengeById } = require('../models/challengeModel');

const toPublic = (doc) => {
  if (!doc) return null;
  const { flag, ...safe } = doc;  // hide flag
  return safe;
};

exports.renderHome = async (_req, res, next) => {
  try {
    const challenges = await getAllChallenges();
    res.render('home', { challenges });
  } catch (e) { next(e); }
};

exports.renderChallenges = async (_req, res, next) => {
  try {
    const challenges = await getAllChallenges();
    res.render('challenges', { challenges });
  } catch (e) { next(e); }
};

exports.renderPlay = async (req, res, next) => {
  try {
    // ✅ works for /play/:id OR /play?id=...
    const id = req.params.id || req.query.id;
    if (!id) return res.status(400).render('submissionResult', {
      ok: false, challengeTitle: 'No challenge ID provided in URL.', submittedFlag: ''
    });

    const challenge = await getChallengeById(id);
    if (!challenge) {
      return res.status(404).render('submissionResult', {
        ok: false, challengeTitle: 'Challenge not found', submittedFlag: ''
      });
    }

    res.render('play', { challenge: toPublic(challenge) });
  } catch (e) { next(e); }
};
