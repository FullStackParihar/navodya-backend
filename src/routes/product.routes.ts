import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);
router.post('/products', authenticate, requireAdmin, createProduct);
router.patch('/products/:id', authenticate, requireAdmin, updateProduct);
router.delete('/products/:id', authenticate, requireAdmin, deleteProduct);

router.get('/categories', getCategories);
router.get('/categories/:slug', getCategoryBySlug);
router.post('/categories', authenticate, requireAdmin, createCategory);
router.patch('/categories/:id', authenticate, requireAdmin, updateCategory);
router.delete('/categories/:id', authenticate, requireAdmin, deleteCategory);

export default router;
