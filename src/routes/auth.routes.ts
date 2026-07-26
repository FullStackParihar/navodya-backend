import { Router } from 'express';
import multer from 'multer';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  googleLogin,
  sendOtp,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  sendOtpSchema,
} from '../validations/auth.validation.js';

const router = Router();
const profileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.mimetype)) {
      cb(new Error('Only JPG, PNG, and WEBP profile images are allowed'));
      return;
    }
    cb(null, true);
  },
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google-login', googleLogin);
router.post('/send-otp', validate(sendOtpSchema), sendOtp);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, profileUpload.single('avatar'), validate(updateProfileSchema), updateProfile);

export default router;
