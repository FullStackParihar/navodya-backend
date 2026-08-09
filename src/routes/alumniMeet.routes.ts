import { Router } from 'express';
import {
    getAlumniMeets,
    getAlumniMeetById,
    createAlumniMeet,
    updateAlumniMeet,
    deleteAlumniMeet
} from '../controllers/alumniMeet.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getAlumniMeets);
router.get('/:id', getAlumniMeetById);

// Admin only routes
router.post('/', authenticate, requireAdmin, createAlumniMeet);
router.patch('/:id', authenticate, requireAdmin, updateAlumniMeet);
router.delete('/:id', authenticate, requireAdmin, deleteAlumniMeet);

export default router;
