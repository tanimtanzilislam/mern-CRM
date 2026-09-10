require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI?.trim();

app.use(cors());
app.use(express.json());

app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('MERN CRM API is running');
});

if (!MONGODB_URI || /<[^>]+>|\*{2,}/.test(MONGODB_URI)) {
  console.error(
    'MONGODB_URI is missing or still contains placeholders. Set the real Atlas URI in backend/.env.'
  );
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
