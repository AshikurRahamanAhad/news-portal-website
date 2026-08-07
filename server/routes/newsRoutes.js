import express from 'express';
import {
  getTopNews,
  getAllNews,
  getNewsById,
  getMyNews,
  createNews,
  updateNews,
  deleteNews,
} from '../controllers/newsController.js';
import { protect, isReporter } from '../middleware/authMiddleware.js';

const router = express.Router();

// Guests & logged-in users can read
router.get('/top', getTopNews);
router.get('/', getAllNews);
router.get('/:id', getNewsById);

// Protected user routes
router.get('/user/my-news', protect, getMyNews);

// Only logged-in Reporters/Admins can publish/edit/delete
router.post('/', protect, isReporter, createNews);
router.put('/:id', protect, updateNews);
router.delete('/:id', protect, deleteNews);

export default router;