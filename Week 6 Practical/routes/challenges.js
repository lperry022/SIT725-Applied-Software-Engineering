// routes/challenges.js
const express = require('express');
const router = express.Router();

const challengeCtrl = require('../controllers/challengeController');
const submissionCtrl = require('../controllers/submissionController');
const { getAllChallenges } = require('../models/challengeModel');

// Pages
router.get('/', challengeCtrl.renderHome);
router.get('/challenges', challengeCtrl.renderChallenges);
router.get('/play/:id', challengeCtrl.renderPlay);
router.get('/sample', (_req, res) => res.render('sample')); // <-- renders views/sample.ejs

// Submissions
router.post('/submit/:id', submissionCtrl.handleSubmitFlag);

router.get('/play/:id', challengeCtrl.renderPlay);
const { getAllChallenges } = require('../models/challengeModel');
router.get('/api/challenges', async (_req, res, next) => {
  try { res.json(await getAllChallenges()); }
  catch (e) { next(e); }
});
// JSON API (used by your client JS)
router.get('/api/challenges', async (_req, res, next) => {
  try {
    const list = await getAllChallenges(); // excludes flag
    res.json(list);
  } catch (e) { next(e); }
});
router.get('/sample/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.send('No challenge ID provided in URL.');
  const challenge = await Challenge.findById(id);
  res.render('sample', { challenge });
});


module.exports = router;
