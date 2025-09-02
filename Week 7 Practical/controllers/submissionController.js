const { getChallengeSafeById, verifyFlag } = require('../models/challengeModel');

exports.handleSubmitFlag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const flag = (req.body?.flag || req.body?.answer || req.body?.flagInput || '').trim();

    if (!flag) {
      return res.status(400).json({ error: 'flag is required' });
    }

    const challenge = await getChallengeSafeById(id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const ok = await verifyFlag(id, flag);
    if (!ok) {
      return res.status(400).json({ correct: false, error: 'Incorrect flag' });
    }

    return res.status(200).json({ correct: true, pointsAwarded: challenge.points });
  } catch (err) {
    next(err);
  }
};
