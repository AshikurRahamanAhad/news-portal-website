import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify user logged in
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found or account deleted' });
      }

      return next(); 
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Verify user has Reporter or Admin role
export const isReporter = (req, res, next) => {
  if (req.user && (req.user.role === 'Reporter' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Only news reporters can publish articles.' });
  }
};