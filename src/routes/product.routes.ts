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
import { authenticate, requireAdmin, optionalAuth } from '../middlewares/auth.middleware.js';
import { Product } from '../models/product.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

const router = Router();

router.get('/products', optionalAuth, getProducts);

router.get('/products/id/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json(new ApiResponse(404, null, 'Product not found'));
  }
  
  const isAdmin = (req as any).user?.role === 'admin';
  
  const product = await Product.findById(id).populate('category_id', 'name slug');
  if (!product) {
    return res.status(404).json(new ApiResponse(404, null, 'Product not found'));
  }
  if (!product.is_active && !isAdmin) {
    return res.status(404).json(new ApiResponse(404, null, 'Product not found'));
  }
  
  res.status(200).json(new ApiResponse(200, product, 'Product retrieved successfully'));
}));

router.get('/products/:slug', optionalAuth, getProductBySlug);
router.post('/products', authenticate, requireAdmin, createProduct);
router.patch('/products/:id', authenticate, requireAdmin, updateProduct);
router.delete('/products/:id', authenticate, requireAdmin, deleteProduct);

router.get('/categories', optionalAuth, getCategories);
router.get('/categories/:slug', optionalAuth, getCategoryBySlug);
router.post('/categories', authenticate, requireAdmin, createCategory);
router.patch('/categories/:id', authenticate, requireAdmin, updateCategory);
router.delete('/categories/:id', authenticate, requireAdmin, deleteCategory);

export default router;
