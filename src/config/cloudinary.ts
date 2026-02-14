import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
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

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: any, file: any) => {
        return {
            folder: 'navodaya',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
            public_id: file.originalname.split('.')[0] + '-' + Date.now(),
        };
    },
});

export const upload = multer({ storage: storage });
export default cloudinary;
