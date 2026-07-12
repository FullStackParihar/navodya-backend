import { Request, Response } from 'express';
import Contest from '../models/contest.model.js';
import ContestParticipant from '../models/contestParticipant.model.js';
import Winner from '../models/winner.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Get all contests (Admin sees all, Public sees active only)
export const getContests = asyncHandler(async (req: Request, res: Response) => {
    const { isAdmin } = req.query;
    const filter = isAdmin === 'true' ? {} : { isActive: true };
    const contests = await Contest.find(filter).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, contests, 'Contests fetched successfully'));
});

export const getContestById = asyncHandler(async (req: Request, res: Response) => {
    const contest = await Contest.findById(req.params.id);
    if (!contest) {
        return res.status(404).json(new ApiResponse(404, null, 'Contest not found'));
    }
    res.status(200).json(new ApiResponse(200, contest, 'Contest fetched successfully'));
});

// Admin: Create Contest
export const createContest = asyncHandler(async (req: Request, res: Response) => {
    const contest = await Contest.create(req.body);
    res.status(201).json(new ApiResponse(201, contest, 'Contest created successfully'));
});

// Admin: Update Contest
export const updateContest = asyncHandler(async (req: Request, res: Response) => {
    const contest = await Contest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!contest) {
        return res.status(404).json(new ApiResponse(404, null, 'Contest not found'));
    }
    res.status(200).json(new ApiResponse(200, contest, 'Contest updated successfully'));
});

// Admin: Delete Contest
export const deleteContest = asyncHandler(async (req: Request, res: Response) => {
    const contest = await Contest.findByIdAndDelete(req.params.id);
    if (!contest) {
        return res.status(404).json(new ApiResponse(404, null, 'Contest not found'));
    }
    await ContestParticipant.deleteMany({ contest_id: req.params.id });
    await Winner.deleteMany({ contest_id: req.params.id });
    res.status(200).json(new ApiResponse(200, null, 'Contest deleted successfully'));
});

// User: Participate in Contest
export const participateInContest = asyncHandler(async (req: Request, res: Response) => {
    const contestId = req.params.id;
    const userId = (req as any).user._id;

    const contest = await Contest.findById(contestId);
    if (!contest || !contest.isActive) {
        return res.status(400).json(new ApiResponse(400, null, 'Contest is not active or does not exist'));
    }

    const now = new Date();
    if (now < contest.startDate || now > contest.endDate) {
        return res.status(400).json(new ApiResponse(400, null, 'Contest is outside of the active date range'));
    }

    const existingEntry = await ContestParticipant.findOne({ contest_id: contestId, user_id: userId });
    if (existingEntry) {
        return res.status(400).json(new ApiResponse(400, null, 'You have already participated in this contest'));
    }

    const entry = await ContestParticipant.create({
        contest_id: contestId,
        user_id: userId
    });

    res.status(201).json(new ApiResponse(201, entry, 'Successfully participated in the contest'));
});

// Admin: Get Contest Participants
export const getContestParticipants = asyncHandler(async (req: Request, res: Response) => {
    const contestId = req.params.id;
    
    // We populate the user_id to get user details (name, email)
    const participants = await ContestParticipant.find({ contest_id: contestId })
        .populate('user_id', 'name email mobile')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, participants, 'Participants fetched successfully'));
});
