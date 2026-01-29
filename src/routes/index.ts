import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import cartRoutes from './cart.routes.js';
import favoriteRoutes from './favorite.routes.js';
import couponRoutes from './coupon.routes.js';
import orderRoutes from './order.routes.js';
import reviewRoutes from './review.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', productRoutes);
router.use('/cart', cartRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/coupons', couponRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
