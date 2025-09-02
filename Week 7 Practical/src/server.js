require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/forensix';

console.log('Connecting to Mongo:', MONGO_URI);

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
