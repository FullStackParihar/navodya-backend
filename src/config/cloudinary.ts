import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { config } from './env.js';

if (!config.cloudinary.apiKey) {
    console.warn('Cloudinary API Key is missing. Image uploads will fail.');
}

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default cloudinary;
