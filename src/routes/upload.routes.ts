import { Router } from 'express';
import cloudinary, { upload } from '../config/cloudinary.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const uploadToCloudinary = (file: Express.Multer.File) => {
  const publicIdBase = file.originalname.split('.')[0] || 'upload';

  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'navodaya',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        public_id: `${publicIdBase}-${Date.now()}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(file.buffer);
  });
};

router.post('/upload', authenticate, requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json(new ApiResponse(400, null, 'No file uploaded'));
    }

    const uploadedImage = await uploadToCloudinary(req.file as Express.Multer.File);

    res.status(200).json(new ApiResponse(200, {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id
    }, 'File uploaded successfully'));
}));

export default router;
