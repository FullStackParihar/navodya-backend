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
    limits: { fileSize: 20 * 1024 * 1024 }, 
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
    limits: { fileSize: 20 * 1024 * 1024 }, 
  });
}

export { upload, isCloudinaryConfigured };
export default cloudinary;
