// models/challengeModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Challenge = require('./Challenge');

// Fallback data when Mongo isn't connected
const seed = [
  { id: '1', title: 'Disk Forensics: Hidden File', description: 'Find the hidden file and extract the secret.', difficulty: 'Easy', points: 100, image: '/images/challenge.png' },
  { id: '2', title: 'PCAP: Find the Beacon', description: 'Analyze the PCAP to identify C2 beacon intervals.', difficulty: 'Medium', points: 200, image: '/images/challenge.png' }
];

const SAFE_PROJECTION = { flag: 0, flagHash: 0, __v: 0 };

function mongoReady() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// Normalize a Mongoose doc/POJO to always expose `id` and never `_id`
function normalize(doc) {
  if (!doc) return null;
  const obj = { ...doc };
  // prefer custom string id; otherwise derive from _id
  const id = obj.id || (obj._id ? String(obj._id) : undefined);
  delete obj._id;
  return { id, ...obj };
}

/* ----------------------- Public getters (SAFE) ----------------------- */

// List all challenges (safe fields only)
async function getAllChallenges() {
  if (!mongoReady()) {
    // Offline: return seed normalized (already safe)
    return seed.map(normalize);
  }
  const docs = await Challenge.find({}, SAFE_PROJECTION).lean();
  return docs.map(normalize);
}

// Get one challenge by either custom id OR Mongo _id (safe fields only)
async function getChallengeSafeById(idOrObjectId) {
  if (!mongoReady()) {
    const hit = seed.find(c => c.id === String(idOrObjectId));
    return normalize(hit);
  }

  // Try custom id first
  let doc = await Challenge.findOne({ id: String(idOrObjectId) }, SAFE_PROJECTION).lean();
  if (doc) return normalize(doc);

  // Then try ObjectId if valid
  if (mongoose.isValidObjectId(idOrObjectId)) {
    doc = await Challenge.findById(idOrObjectId, SAFE_PROJECTION).lean();
    if (doc) return normalize(doc);
  }
  return null;
}

/* ----------------------- Internal/legacy (UNSAFE) ----------------------- */
// Keep this only if other code depends on it (not recommended for API responses)
async function getChallengeById(idOrObjectId) {
  if (!mongoReady()) {
    return seed.find(c => c.id === String(idOrObjectId)) || null;
  }
  // Try custom id first
  let doc = await Challenge.findOne({ id: String(idOrObjectId) }).lean();
  if (doc) return doc;
  if (mongoose.isValidObjectId(idOrObjectId)) {
    return Challenge.findById(idOrObjectId).lean();
  }
  return null;
}

/* ----------------------- Flag verification ----------------------- */
// Accepts either custom id OR _id; supports hashed or plain flags in DB
async function verifyFlag(idOrObjectId, submittedFlag) {
  const flag = (submittedFlag || '').trim();
  if (!flag) return false;

  if (!mongoReady()) return false; // No secret verification in offline mode

  // Fetch a minimal doc with secret fields
  let doc = await Challenge.findOne(
    { id: String(idOrObjectId) },
    { flag: 1, flagHash: 1 }
  ).lean();

  if (!doc && mongoose.isValidObjectId(idOrObjectId)) {
    doc = await Challenge.findById(idOrObjectId, { flag: 1, flagHash: 1 }).lean();
  }
  if (!doc) return false;

  // Prefer bcrypt hash if present; otherwise fall back to plain equality
  if (doc.flagHash) {
    try {
      return await bcrypt.compare(flag, doc.flagHash);
    } catch {
      return false;
    }
  }
  if (doc.flag) {
    return flag === doc.flag;
  }
  return false;
}

module.exports = {
  getAllChallenges,
  getChallengeSafeById,
  getChallengeById,     // optional / legacy
  verifyFlag
};
