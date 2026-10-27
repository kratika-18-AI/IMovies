import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
      return res.status(400).json({ message: 'Name, valid email, and password (at least 8 characters) are required.' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { subject: user.id, expiresIn: '2h' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(String(password || ''), user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { subject: user.id, expiresIn: '2h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) { next(error); }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('name email').lean();
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ id: req.user.id, ...user });
  } catch (error) { next(error); }
});

export default router;
