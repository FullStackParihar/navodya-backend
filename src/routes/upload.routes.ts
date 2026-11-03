import { Router } from 'express';
import { upload, uploadDesign, isCloudinaryConfigured } from '../config/cloudinary.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const handleUpload = (uploader: any) => {
  return (req: any, res: any, next: any) => {
    uploader.any()(req, res, (err: any) => {
      if (err) {
        return res.status(400).json(new ApiResponse(400, null, err.message || 'File upload error'));
      }
      next();
    });
  };
};

const processUploadedFiles = (req: any, res: any, subfolder = '') => {
  const files: any[] = (req.files as any[]) || (req.file ? [req.file] : []);
  if (!files.length) {
    return res.status(400).json(new ApiResponse(400, null, 'No file uploaded'));
  }

  const uploaded = files.map((file: any) => {
    let url: string;
    let public_id: string;

    if (isCloudinaryConfigured) {
      url = file.path || file.secure_url || file.url;
      public_id = file.filename || file.public_id || file.originalname;
    } else {
      const protocol = req.protocol;
      const host = req.get('host');
      const dir = subfolder ? `uploads/${subfolder}` : 'uploads';
      url = `${protocol}://${host}/${dir}/${file.filename}`;
      public_id = file.filename;
    }

    return {
      url,
      public_id,
      publicId: public_id,
      name: file.originalname,
      size: file.size
    };
  });

  const primary = uploaded[0];
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        url: primary.url,
        public_id: primary.public_id,
        publicId: primary.publicId,
        files: uploaded
      },
      'File uploaded successfully'
    )
  );
};

// General upload: handles both POST /api/upload and POST /api/upload/upload
router.post('/', optionalAuth, handleUpload(upload), asyncHandler(async (req, res) => {
  processUploadedFiles(req, res);
}));

router.post('/upload', optionalAuth, handleUpload(upload), asyncHandler(async (req, res) => {
  processUploadedFiles(req, res);
}));

// Design upload: handles POST /api/upload/design and POST /api/upload/upload-design
router.post('/design', optionalAuth, handleUpload(uploadDesign), asyncHandler(async (req, res) => {
  processUploadedFiles(req, res, 'designs');
}));

router.post('/upload-design', optionalAuth, handleUpload(uploadDesign), asyncHandler(async (req, res) => {
  processUploadedFiles(req, res, 'designs');
}));

export default router;
