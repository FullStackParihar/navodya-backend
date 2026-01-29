import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { addToCartSchema, updateCartItemSchema } from '../validations/cart.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/add', validate(addToCartSchema), addToCart);
router.patch('/update/:id', validate(updateCartItemSchema), updateCartItem);
router.delete('/remove/:id', removeFromCart);
router.post('/clear', clearCart);

export default router;
