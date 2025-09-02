const { registerUser, authenticateUser } = require('../models/userModel');

// GET /login
exports.renderLogin = (_req, res) => {
  // Create views/login.ejs later if you want a real screen
  res.status(501).send('Login view not implemented yet. (Create views/login.ejs)');
};

// POST /login
exports.handleLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    const ok = await authenticateUser(username, password);
    if (!ok) return res.status(401).send('Invalid credentials');
    // Add session/cookie if you enable auth
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

// GET /register
exports.renderRegister = (_req, res) => {
  res.status(501).send('Register view not implemented yet. (Create views/register.ejs)');
};

// POST /register
exports.handleRegister = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    await registerUser(username, password);
    res.redirect('/login');
  } catch (err) {
    next(err);
  }
};

// POST /logout
exports.handleLogout = (_req, res) => {
  // Clear session/cookie if you enable auth
  res.redirect('/');
};