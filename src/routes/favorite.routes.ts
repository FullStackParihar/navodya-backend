import { Router } from 'express';
import {
  getFavorites,
  toggleFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/favorite.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getFavorites);
router.post('/toggle/:productId', toggleFavorite);
router.delete('/:productId', removeFavorite);
router.get('/check/:productId', checkFavorite);

export default router;
