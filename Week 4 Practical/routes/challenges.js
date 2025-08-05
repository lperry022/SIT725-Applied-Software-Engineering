const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');

// POST /api/challenges
router.post('/', async (req, res) => {
  try {
    const challenge = new Challenge({
      title: 'Sample Challenge',
      description: 'This is a test challenge',
      difficulty: 'Easy',
      category: 'Intro',
      image: '/public/images/challenge.png',
      flag: 'FLAG{sample_flag}',
      solutionSteps: [
        'Download the image',
        'Use binwalk to inspect the file',
        'Extract embedded files',
        'Find the flag inside hidden content'
      ]
    });

    const saved = await challenge.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /api/challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/challenges/:id
router.get('/:id', async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const challenge = await Challenge.findOne({ _id: id });
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// PUT (update)
router.put('/:id', async (req, res) => {
  const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE (remove)
router.delete('/:id', async (req, res) => {
  await Challenge.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});


module.exports = router;
