import { Router } from 'express';
import { addReview, getProductReviews } from '../controllers/review.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/:productId', getProductReviews);

// Protected routes
router.post('/:productId', authenticate, addReview);

export default router;
