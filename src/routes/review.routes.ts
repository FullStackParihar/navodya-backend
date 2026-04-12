import { Router } from 'express';
import { addReview, getProductReviews } from '../controllers/review.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { addReviewSchema, productReviewParamSchema } from '../validations/review.validation.js';

const router = Router();

// Public routes
router.get('/:productId', validate(productReviewParamSchema), getProductReviews);

// Protected routes
router.post('/:productId', authenticate, validate(addReviewSchema), addReview);

export default router;
