import { Request, Response } from 'express';
import Event from '../models/event.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Get all events (Admin sees all, Public sees active only)
export const getEvents = asyncHandler(async (req: Request, res: Response) => {
    const { isAdmin } = req.query;
    const filter = isAdmin === 'true' ? {} : { isActive: true, isEnabled: { $ne: false } };
    const events = await Event.find(filter).sort({ date: 1 });
    res.status(200).json(new ApiResponse(200, events, 'Events fetched successfully'));
});

export const getEventById = asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
        return res.status(404).json(new ApiResponse(404, null, 'Event not found'));
    }
    res.status(200).json(new ApiResponse(200, event, 'Event fetched successfully'));
});

// Admin: Create Event
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.create(req.body);
    res.status(201).json(new ApiResponse(201, event, 'Event created successfully'));
});

// Admin: Update Event
export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) {
        return res.status(404).json(new ApiResponse(404, null, 'Event not found'));
    }
    res.status(200).json(new ApiResponse(200, event, 'Event updated successfully'));
});

// Admin: Delete Event
export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
        return res.status(404).json(new ApiResponse(404, null, 'Event not found'));
    }
    res.status(200).json(new ApiResponse(200, null, 'Event deleted successfully'));
});
