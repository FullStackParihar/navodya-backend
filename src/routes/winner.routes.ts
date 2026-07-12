import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import {
  drawRandomWinner,
  createWinner,
  getWinnersAdmin,
  getWinnersPublic,
  updateWinner,
  deleteWinner
} from '../controllers/winner.controller.js';

const router = Router();

// Public routes
router.get('/', getWinnersPublic);

// Admin routes
router.use(authenticate);
router.use(requireAdmin);

router.post('/random/:contestId', drawRandomWinner);
router.get('/admin', getWinnersAdmin);
router.post('/', createWinner);
router.patch('/:id', updateWinner);
router.delete('/:id', deleteWinner);

export default router;
