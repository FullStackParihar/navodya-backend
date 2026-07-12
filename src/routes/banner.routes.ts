import { Router } from 'express';
import { getActiveBanners } from '../controllers/banner.controller.js';

const router = Router();
router.get('/active', getActiveBanners);
export default router;
