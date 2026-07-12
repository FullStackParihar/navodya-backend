import { Router } from 'express';
import {
    getAdminStats,
    getAllOrders,
    getAdminOrderById,
    getAllUsers,
    updateOrderStatus,
    updateOrderTracking,
    deleteUser
} from '../controllers/admin.controller.js';
import {
    getAdminBulkOrders,
    getAdminBulkOrderById,
    updateAdminBulkOrder,
    updateAdminBulkOrderStatus
} from '../controllers/bulkOrder.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { upload, isCloudinaryConfigured } from '../config/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
    createBanner, deleteBanner, getAdminBanners, reorderBanners,
    updateBanner, updateBannerStatus
} from '../controllers/banner.controller.js';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/banners', getAdminBanners);
router.post('/banners/upload', (req, res, next) => {
    upload.single('image')(req, res, (err) => err ? res.status(400).json(new ApiResponse(400, null, err.message)) : next());
}, (req, res) => {
    if (!req.file) return res.status(400).json(new ApiResponse(400, null, 'A banner image is required'));
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(req.file.mimetype)) {
        return res.status(400).json(new ApiResponse(400, null, 'Only JPG, PNG, and WebP images are allowed'));
    }
    const file = req.file as any;
    const url = isCloudinaryConfigured ? file.path : `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    return res.json(new ApiResponse(200, { url, publicId: file.filename }, 'Banner image uploaded successfully'));
});
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.patch('/banners/:id/status', updateBannerStatus);
router.patch('/banners/reorder', reorderBanners);
router.delete('/banners/:id', deleteBanner);
router.get('/orders', getAllOrders);
router.get('/orders/:orderId', getAdminOrderById);
router.get('/bulk-orders', getAdminBulkOrders);
router.get('/bulk-orders/:id', getAdminBulkOrderById);
router.get('/users', getAllUsers);
router.patch('/orders/:orderId/status', updateOrderStatus);
router.patch('/orders/:orderId/tracking', updateOrderTracking);
router.patch('/bulk-orders/:id/status', updateAdminBulkOrderStatus);
router.patch('/bulk-orders/:id', updateAdminBulkOrder);
router.delete('/users/:userId', deleteUser);

export default router;
