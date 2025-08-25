// server.js
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// --- middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static + views
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- routes ---
const challengeRoutes = require('./routes/challenges');
app.use('/', challengeRoutes);

// --- env ---
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/forensix';

console.log('Connecting to Mongo:', MONGO_URI);

// --- start after DB connects ---
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`ForensiX running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Tip: If using Atlas, add your IP in Network Access, or use local mongod.');
    process.exit(1);
  });
