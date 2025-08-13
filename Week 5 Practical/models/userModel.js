// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, index: true },
  email: { type: String, unique: true, sparse: true },
  passwordHash: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function registerUser(username, password, email) {
  const existing = await User.findOne({ username }).lean();
  if (existing) throw new Error('Username already exists');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash });
  return { id: user._id.toString(), username: user.username, email: user.email };
}

async function authenticateUser(username, password) {
  const user = await User.findOne({ username });
  if (!user) return false;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? { id: user._id.toString(), username: user.username } : false;
}

module.exports = {
  User,
  registerUser,
  authenticateUser,
};
