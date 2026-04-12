import { Router } from 'express';
import {
    getAdminStats,
    getAllOrders,
    getAllUsers,
    updateOrderStatus,
    deleteUser
} from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { deleteUserParamSchema, updateOrderStatusSchema } from '../validations/admin.validation.js';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/orders', getAllOrders);
router.get('/users', getAllUsers);
router.patch('/orders/:orderId/status', validate(updateOrderStatusSchema), updateOrderStatus);
router.delete('/users/:userId', validate(deleteUserParamSchema), deleteUser);

export default router;
