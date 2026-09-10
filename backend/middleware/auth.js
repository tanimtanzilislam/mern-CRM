const jwt = require('jsonwebtoken');
const User = require('../models/User');

function getSecret() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured.');
  return process.env.JWT_SECRET;
}

async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const payload = jwt.verify(header.slice(7), getSecret());
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    req.user = user;
    return next();
  } catch (error) {
    if (error.message === 'JWT_SECRET is not configured.') {
      return res.status(500).json({ message: error.message });
    }
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Insufficient permissions' });
    return next();
  };
}

module.exports = { requireAuth, requireRoles, getSecret };
