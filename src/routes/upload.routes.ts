import { Router } from 'express';
import { upload, isCloudinaryConfigured } from '../config/cloudinary.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import path from 'path';

const router = Router();

router.post('/upload', authenticate, requireAdmin, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json(new ApiResponse(400, null, err.message || 'File upload error'));
        }
        next();
    });
}, asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json(new ApiResponse(400, null, 'No file uploaded'));
    }

    let fileUrl;
    let publicId;

    if (isCloudinaryConfigured) {
        fileUrl = (req.file as any).path;
        publicId = (req.file as any).filename;
    } else {
        const protocol = req.protocol;
        const host = req.get('host');
        fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        publicId = req.file.filename;
    }

    res.status(200).json(new ApiResponse(200, {
        url: fileUrl,
        public_id: publicId
    }, 'File uploaded successfully'));
}));

export default router;
