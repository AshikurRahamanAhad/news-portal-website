import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  toggleSaveNews,
  getSavedNews,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected user profile routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Protected bookmark routes (Private to logged-in user)
router.post('/save/:newsId', protect, toggleSaveNews);
router.get('/saved-news', protect, getSavedNews);

export default router;