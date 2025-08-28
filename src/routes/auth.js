const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'dev-secret';

// REGISTER
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      const e = new Error('Missing fields'); e.status = 400; e.expose = true; throw e;
    }

    const exists = await User.findOne({ email });
    if (exists) { const e = new Error('Email already registered'); e.status = 400; e.expose = true; throw e; }

    const user = await User.create({ name, email, password });
    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET, { expiresIn: '2h' });

    res.json({ message: 'User registered successfully', token });
  } catch (err) { next(err); }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email }).select('+password');
    if (!user) { const e = new Error('Invalid credentials'); e.status = 401; e.expose = true; throw e; }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) { const e = new Error('Invalid credentials'); e.status = 401; e.expose = true; throw e; }

    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET, { expiresIn: '2h' });
    res.json({ message: 'Login successful', token });
  } catch (err) { next(err); }
});

module.exports = router;
