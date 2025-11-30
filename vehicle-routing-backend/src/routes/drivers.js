/**
 * Drivers API routes
 * CommonJS + Express
 */
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'replace_with_strong_secret';
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

// Simple auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing auth token' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.driver = payload; // contains id/userId
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Register driver
router.post('/register', async (req, res) => {
  try {
    const { userId, name, contactNumber, vehicleName, licenseNumber, password } = req.body;
    if (!userId || !name || !contactNumber || !licenseNumber || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const exists = await Driver.findOne({ $or: [{ userId }, { licenseNumber }] }).lean();
    if (exists) return res.status(409).json({ error: 'Driver with same userId or licenseNumber exists' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const doc = await Driver.create({ userId, name, contactNumber, vehicleName, licenseNumber, passwordHash });
    return res.status(201).json({ id: doc._id, userId: doc.userId });
  } catch (err) {
    console.error('Register driver error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) return res.status(400).json({ error: 'Missing credentials' });
    const driver = await Driver.findOne({ userId }).lean();
    if (!driver) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, driver.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: driver._id, userId: driver.userId }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, expiresIn: 8 * 3600 });
  } catch (err) {
    console.error('Driver login error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const driver = await Driver.findById(req.driver.id).select('-passwordHash').lean();
    if (!driver) return res.status(404).json({ error: 'Not found' });
    return res.json(driver);
  } catch (err) {
    console.error('Driver me error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Increment distance (only owner)
router.post('/:id/add-distance', authMiddleware, async (req, res) => {
  try {
    const targetId = req.params.id;
    if (req.driver.id !== targetId && req.driver.userId !== req.body.userId) {
      // simple owner check: token id must match target id
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { distance } = req.body;
    const inc = Number(distance) || 0;
    const doc = await Driver.findByIdAndUpdate(targetId, { $inc: { distanceDriven: inc } }, { new: true }).select('-passwordHash').lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(doc);
  } catch (err) {
    console.error('Add distance error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Admin-style list
router.get('/', authMiddleware, async (req, res) => {
  try {
    const list = await Driver.find({}).select('-passwordHash').lean();
    return res.json(list);
  } catch (err) {
    console.error('Drivers list error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
