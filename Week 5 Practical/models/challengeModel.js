// models/challengeModel.js
const mongoose = require('mongoose');
const Challenge = require('./Challenge');

const seed = [
  { id: '1', title: 'Disk Forensics: Hidden File', description: 'Find the hidden file and extract the secret.', difficulty: 'Easy', points: 100, image: '/images/challenge.png' },
  { id: '2', title: 'PCAP: Find the Beacon', description: 'Analyze the PCAP to identify C2 beacon intervals.', difficulty: 'Medium', points: 200, image: '/images/challenge.png' }
];

function mongoReady() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

async function getAllChallenges() {
  if (!mongoReady()) return seed;
  return Challenge.find({}, { flag: 0 }).lean();
}

async function getChallengeById(id) {
  if (!mongoReady()) return seed.find(c => c.id === String(id)) || null;
  if (!mongoose.isValidObjectId(id)) return null;
  return Challenge.findById(id).lean();
}

async function verifyFlag(id, submittedFlag) {
  if (!mongoReady()) return false; // skip checking when offline
  if (!mongoose.isValidObjectId(id)) return false;
  const doc = await Challenge.findById(id, { flag: 1 }).lean();
  return !!doc && (submittedFlag || '').trim() === doc.flag;
}

module.exports = { getAllChallenges, getChallengeById, verifyFlag };
