import express from 'express';
import {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  getMyNews,
} from '../controllers/newsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getNews);
router.get('/mine/list', protect, authorize('reporter', 'admin'), getMyNews);
router.get('/:slug', getNewsBySlug);

// Reporter & Admin only
router.post('/', protect, authorize('reporter', 'admin'), createNews);
router.put('/:id', protect, authorize('reporter', 'admin'), updateNews);
router.delete('/:id', protect, authorize('reporter', 'admin'), deleteNews);

export default router;
