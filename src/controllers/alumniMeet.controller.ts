import { Request, Response } from 'express';
import AlumniMeet from '../models/alumniMeet.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Get all alumni meets (Admin sees all, Public sees active only)
export const getAlumniMeets = asyncHandler(async (req: Request, res: Response) => {
    const { isAdmin } = req.query;
    const filter = isAdmin === 'true' ? {} : { isActive: true, isEnabled: { $ne: false } };
    const meets = await AlumniMeet.find(filter).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, meets, 'Alumni meets fetched successfully'));
});

export const getAlumniMeetById = asyncHandler(async (req: Request, res: Response) => {
    const meet = await AlumniMeet.findById(req.params.id);
    if (!meet) {
        return res.status(404).json(new ApiResponse(404, null, 'Alumni meet not found'));
    }
    res.status(200).json(new ApiResponse(200, meet, 'Alumni meet fetched successfully'));
});

// Admin: Create Alumni Meet
export const createAlumniMeet = asyncHandler(async (req: Request, res: Response) => {
    const meet = await AlumniMeet.create(req.body);
    res.status(201).json(new ApiResponse(201, meet, 'Alumni meet created successfully'));
});

// Admin: Update Alumni Meet
export const updateAlumniMeet = asyncHandler(async (req: Request, res: Response) => {
    const meet = await AlumniMeet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!meet) {
        return res.status(404).json(new ApiResponse(404, null, 'Alumni meet not found'));
    }
    res.status(200).json(new ApiResponse(200, meet, 'Alumni meet updated successfully'));
});

// Admin: Delete Alumni Meet
export const deleteAlumniMeet = asyncHandler(async (req: Request, res: Response) => {
    const meet = await AlumniMeet.findByIdAndDelete(req.params.id);
    if (!meet) {
        return res.status(404).json(new ApiResponse(404, null, 'Alumni meet not found'));
    }
    res.status(200).json(new ApiResponse(200, null, 'Alumni meet deleted successfully'));
});
