import dotenv from 'dotenv';
dotenv.config();
console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Exists' : 'Missing');
