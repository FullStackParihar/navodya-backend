import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { config } from './env.js';
import fs from 'fs';
import path from 'path';

const isCloudinaryConfigured =
  config.cloudinary.cloudName &&
  config.cloudinary.cloudName !== 'demo-cloud-name' &&
  config.cloudinary.apiKey &&
  config.cloudinary.apiKey !== 'demo-api-key' &&
  config.cloudinary.apiSecret &&
  config.cloudinary.apiSecret !== 'demo-api-secret';

let storage: multer.StorageEngine;
let upload: multer.Multer;
let uploadDesign: multer.Multer;

const imageFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPG, PNG, and WebP images are allowed'));
};

// Accepts images and common design file formats
const designFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowedMimes = new Set([
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'application/pdf',
    'application/postscript',        // .ai / .eps
    'application/illustrator',
    'image/svg+xml',
    'application/octet-stream',      // generic fallback for .ai/.eps
  ]);
  if (allowedMimes.has(file.mimetype)) cb(null, true);
  else cb(new Error('Unsupported file type. Allowed: JPG, PNG, WebP, PDF, AI, EPS, SVG'));
};

if (isCloudinaryConfigured) {
  console.log('Cloudinary configured successfully.');

  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: any, file: any) => {
      return {
        folder: 'navodaya',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        public_id: file.originalname.split('.')[0] + '-' + Date.now(),
      };
    },
  });

  upload = multer({
    storage: storage,
    limits: { fileSize: 9 * 1024 * 1024 }, // 9MB limit to avoid Cloudinary free tier 10MB crash
    fileFilter: imageFileFilter,
  });
  // Design uploads — Cloudinary, separate folder
  const designCloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (_req: any, file: any) => ({
      folder: 'navodaya/designs',
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf', 'ai', 'eps', 'svg'],
      public_id: 'design-' + Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_').split('.')[0],
    }),
  });

  uploadDesign = multer({
    storage: designCloudinaryStorage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: designFileFilter,
  });
} else {
  console.warn('Cloudinary not configured. Using local file storage for development.');

  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });

  upload = multer({
    storage: storage,
    limits: { fileSize: 9 * 1024 * 1024 },
    fileFilter: imageFileFilter,
  });

  // Design uploads — local disk fallback into uploads/designs folder
  const designUploadDir = path.join(process.cwd(), 'uploads', 'designs');
  if (!fs.existsSync(designUploadDir)) {
    fs.mkdirSync(designUploadDir, { recursive: true });
  }

  const designStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, designUploadDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'design-' + uniqueSuffix + '-' + file.originalname);
    }
  });

  uploadDesign = multer({
    storage: designStorage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: designFileFilter,
  });
}

export { upload, uploadDesign, isCloudinaryConfigured };
export default cloudinary;
