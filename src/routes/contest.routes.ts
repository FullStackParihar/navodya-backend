import { Router } from 'express';
import {
    getContests,
    getContestById,
    createContest,
    updateContest,
    deleteContest,
    participateInContest,
    getContestParticipants
} from '../controllers/contest.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public / Authenticated user routes
router.get('/', getContests);
router.get('/:id', getContestById);
router.post('/:id/participate', authenticate, participateInContest);

// Admin only routes
router.post('/', authenticate, requireAdmin, createContest);
router.patch('/:id', authenticate, requireAdmin, updateContest);
router.delete('/:id', authenticate, requireAdmin, deleteContest);
router.get('/:id/participants', authenticate, requireAdmin, getContestParticipants);

export default router;
