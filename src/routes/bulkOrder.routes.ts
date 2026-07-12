import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {
  createBulkOrder,
  getMyBulkOrderById,
  getMyBulkOrders,
} from '../controllers/bulkOrder.controller.js';
import { authenticate, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

const uploadDir = path.join(process.cwd(), 'uploads', 'bulk-orders');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 60);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${baseName}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 50,
  },
});

router.get('/my-orders', authenticate, getMyBulkOrders);
router.get('/my-orders/:id', authenticate, getMyBulkOrderById);
router.post('/', optionalAuth, upload.any(), createBulkOrder);

export default router;
