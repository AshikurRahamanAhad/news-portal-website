import User from '../models/User.js';
import Settings from '../models/Settings.js';
import generateToken from '../utils/generateToken.js';

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async (req, res) => {
  try {
    const { name, email, password, role, secretCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const requestedRole = role === 'reporter' || role === 'admin' ? role : 'user';

    if (requestedRole === 'reporter' || requestedRole === 'admin') {
      const settings = await Settings.getOrCreate();
      const expectedCode =
        requestedRole === 'admin' ? settings.adminSecretCode : settings.reporterSecretCode;

      if (!secretCode || secretCode !== expectedCode) {
        return res.status(403).json({ message: `Invalid ${requestedRole} secret code` });
      }
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, role: requestedRole });
    const token = generateToken(user._id);

    res.status(201).json({ token, user: toSafeUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({ token, user: toSafeUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: toSafeUser(req.user) });
};
