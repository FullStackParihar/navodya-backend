import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import cartRoutes from './cart.routes.js';
import favoriteRoutes from './favorite.routes.js';
import couponRoutes from './coupon.routes.js';
import orderRoutes from './order.routes.js';
import reviewRoutes from './review.routes.js';
import adminRoutes from './admin.routes.js';
import uploadRoutes from './upload.routes.js';
import contestRoutes from './contest.routes.js';
import winnerRoutes from './winner.routes.js';
import bulkOrderRoutes from './bulkOrder.routes.js';
import bannerRoutes from './banner.routes.js';
import paymentRoutes from './payment.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', productRoutes);
router.use('/upload', uploadRoutes);
router.use('/cart', cartRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/coupons', couponRoutes);
router.use('/orders', orderRoutes);
router.use('/bulk-orders', bulkOrderRoutes);
router.use('/banners', bannerRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);
router.use('/contests', contestRoutes);
router.use('/winners', winnerRoutes);
router.use('/payments', paymentRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
