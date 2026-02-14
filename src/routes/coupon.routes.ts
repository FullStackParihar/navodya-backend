import express from 'express';
import { createCoupon, validateCoupon, getAllCoupons, deleteCoupon } from '../controllers/coupon.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

// Public (Authenticated User) routes
router.post('/validate', validateCoupon);

// Admin routes
router.post('/', requireAdmin, createCoupon);
router.get('/', requireAdmin, getAllCoupons);
router.delete('/:id', requireAdmin, deleteCoupon);

export default router;
