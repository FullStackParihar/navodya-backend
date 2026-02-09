import { Router } from 'express';
import { getAdminStats } from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', getAdminStats);

export default router;
