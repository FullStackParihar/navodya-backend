import { Router } from 'express';
import { upload } from '../config/cloudinary.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/upload', authenticate, requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json(new ApiResponse(400, null, 'No file uploaded'));
    }

    res.status(200).json(new ApiResponse(200, {
        url: (req.file as any).path,
        public_id: (req.file as any).filename
    }, 'File uploaded successfully'));
}));

export default router;
