import express from 'express';
import { createCoupon, validateCoupon, getAllCoupons, deleteCoupon } from '../controllers/coupon.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { couponIdParamSchema, createCouponSchema, validateCouponSchema } from '../validations/coupon.validation.js';

const router = express.Router();

router.use(authenticate);

// Public (Authenticated User) routes
router.post('/validate', validate(validateCouponSchema), validateCoupon);

// Admin routes
router.post('/', requireAdmin, validate(createCouponSchema), createCoupon);
router.get('/', requireAdmin, getAllCoupons);
router.delete('/:id', requireAdmin, validate(couponIdParamSchema), deleteCoupon);

export default router;
