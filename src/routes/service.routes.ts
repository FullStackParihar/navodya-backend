import { Router } from 'express';
import {
  getAllServices,
  getServiceBySlug,
  getSubServiceBySlug
} from '../controllers/service.controller.js';

const router = Router();

router.get('/', getAllServices);
router.get('/:slug', getServiceBySlug);
router.get('/:serviceSlug/sub-services/:subSlug', getSubServiceBySlug);

export default router;
