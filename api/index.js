const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.set('bufferCommands', false);

const customerRoutes = require('../backend/routes/customers');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/customers', customerRoutes);

app.get('/', (req, res) => {
  res.send('MERN CRM API is running');
});

let connectionPromise;

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (!mongoUri || /<[^>]+>|\*{2,}/.test(mongoUri)) {
    throw new Error('MONGODB_URI is missing or contains placeholders.');
  }

  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    }).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }
  await connectionPromise;
}

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    if (req.url.startsWith('/api')) {
      req.url = req.url.slice(4) || '/';
    }
    return app(req, res);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (error.message === 'MONGODB_URI is missing or contains placeholders.') {
      return res.status(500).json({ message: error.message });
    }
    return res.status(503).json({ message: `MongoDB connection failed: ${error.message}` });
  }
};
