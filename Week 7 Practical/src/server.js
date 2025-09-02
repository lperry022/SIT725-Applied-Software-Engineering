// src/server.js
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { createSocketLayer } = require('./socket');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  const server = http.createServer(app);
  const { io } = createSocketLayer(server);

  // Try DB, but don't block server if it fails
  try {
    if (MONGO_URI) {
      console.log('Connecting to Mongo:', MONGO_URI.replace(/\/\/.*@/,'//<redacted>@'));
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB connected');
    } else {
      console.warn('MONGO_URI not set – running in offline mode (seed only)');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.warn('Starting server in OFFLINE mode (seed only).');
  }

  server.listen(PORT, () => {
    console.log(`ForensiX running at http://localhost:${PORT}`);
  });

  // expose io so controllers can emit events if you want
  app.set('io', io);

  return { server, io };
}

if (require.main === module) start();
module.exports = { start };
