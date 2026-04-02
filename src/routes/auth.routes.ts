import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  validateToken,
  refreshToken,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from '../validations/auth.validation.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.get('/validate', authenticate, validateToken);
router.post('/refresh', authenticate, refreshToken);

export default router;
