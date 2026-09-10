const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth, requireRoles, getSecret } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) return res.status(403).json({ message: 'Only an admin can create users' });
    const { name, email, password, role = count === 0 ? 'admin' : 'staff' } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ message: 'Name, email, and a password of at least 8 characters are required' });
    }
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role });
    const token = jwt.sign({ sub: user._id.toString(), role: user.role }, getSecret(), { expiresIn: '8h' });
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (error) {
    res.status(400).json({ message: error.code === 11000 ? 'Email is already registered' : error.message });
  }
});

router.post('/users', requireAuth, requireRoles('admin'), async (req, res) => {
  try {
    const { name, email, password, role = 'staff' } = req.body;
    if (!name || !email || !password || password.length < 8 || !User.ROLES.includes(role)) {
      return res.status(400).json({ message: 'Valid name, email, password, and role are required' });
    }
    const user = await User.create({ name, email, role, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json(user.toSafeObject());
  } catch (error) {
    res.status(400).json({ message: error.code === 11000 ? 'Email is already registered' : error.message });
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email?.toLowerCase() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(req.body.password || '', user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, getSecret(), { expiresIn: '8h' });
  res.json({ token, user: user.toSafeObject() });
});

router.get('/me', requireAuth, (req, res) => res.json(req.user.toSafeObject()));

router.get('/users', requireAuth, requireRoles('admin'), async (req, res) => {
  res.json((await User.find().sort({ createdAt: -1 })).map((user) => user.toSafeObject()));
});

router.patch('/users/:id/role', requireAuth, requireRoles('admin'), async (req, res) => {
  if (!User.ROLES.includes(req.body.role)) return res.status(400).json({ message: 'Invalid role' });
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user.toSafeObject());
});

module.exports = router;
