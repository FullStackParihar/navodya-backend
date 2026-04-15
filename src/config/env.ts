import dotenv from 'dotenv';

dotenv.config();

const defaultClientUrls = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const clientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const allowedClientUrls = Array.from(new Set([...defaultClientUrls, ...clientUrls]));

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrls: allowedClientUrls,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};
