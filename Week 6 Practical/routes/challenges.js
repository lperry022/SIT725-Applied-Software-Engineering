// routes/challenges.js
const express = require('express');
const router = express.Router();

// Controllers
const challengeCtrl = require('../controllers/challengeController');
const submissionCtrl = require('../controllers/submissionController');

// Models / data helpers
const { getAllChallenges, getChallengeSafeById } = require('../models/challengeModel'); // must exclude flag/flagHash
const Challenge = require('../models/Challenge'); // only used by /sample/:id demo render

// Small async wrapper to avoid repetitive try/catch
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ---------------------- Page Routes (EJS) ---------------------- */
router.get('/', challengeCtrl.renderHome);
router.get('/challenges', challengeCtrl.renderChallenges);
router.get('/play/:id', challengeCtrl.renderPlay);

// Demo page – renders views/sample.ejs with one challenge (safe fields only)
router.get('/sample', (_req, res) => res.render('sample'));
router.get('/sample/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Prefer a safe finder that never returns sensitive fields
  const challenge = await getChallengeSafeById(id) 
    // fallback: never expose secret fields even if using the Mongoose model directly
    ?? await Challenge.findById(id, { flag: 0, flagHash: 0, __v: 0 }).lean();

  if (!challenge) return res.status(404).render('404', { message: 'Challenge not found' });
  return res.render('sample', { challenge });
}));

/* ---------------------- Submission (POST) ---------------------- */
router.post('/submit/:id', submissionCtrl.handleSubmitFlag);

/* ---------------------- JSON API ---------------------- */
// GET /api/challenges – list (no flag/flagHash)
router.get('/api/challenges', asyncHandler(async (_req, res) => {
  const list = await getAllChallenges(); // ensure this excludes secret fields
  return res.status(200).json(list);
}));

// GET /api/challenges/:id – single (no flag/flagHash)
router.get('/api/challenges/:id', asyncHandler(async (req, res) => {
  const doc = await getChallengeSafeById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(doc);
}));

module.exports = router;
