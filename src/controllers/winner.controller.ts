import { Request, Response } from 'express';
import Winner from '../models/winner.model.js';
import ContestParticipant from '../models/contestParticipant.model.js';
import Contest from '../models/contest.model.js';

// Random draw a winner from participants
export const drawRandomWinner = async (req: Request, res: Response) => {
  try {
    const { contestId } = req.params;

    // Verify contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    // Get all participants
    const participants = await ContestParticipant.find({ contest_id: contestId });
    if (participants.length === 0) {
      return res.status(400).json({ success: false, message: 'No participants found for this contest' });
    }

    // Pick random participant
    const randomIndex = Math.floor(Math.random() * participants.length);
    const selectedParticipant = participants[randomIndex];

    // Populate user details for preview
    await selectedParticipant.populate('user_id', 'name email mobile');

    res.status(200).json({
      success: true,
      data: selectedParticipant
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create winner (Save manually or random)
export const createWinner = async (req: Request, res: Response) => {
  try {
    const { contest_id, user_id, prize, isPublished, showUserDetails } = req.body;

    // Check if already a winner for this contest
    const existing = await Winner.findOne({ contest_id, user_id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User is already a winner for this contest' });
    }

    const winner = new Winner({
      contest_id,
      user_id,
      prize,
      isPublished: isPublished || false,
      showUserDetails: showUserDetails || false
    });

    await winner.save();

    res.status(201).json({
      success: true,
      data: winner,
      message: 'Winner saved successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all winners for Admin
export const getWinnersAdmin = async (req: Request, res: Response) => {
  try {
    const winners = await Winner.find()
      .populate('contest_id', 'title bannerImage')
      .populate('user_id', 'name email mobile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: winners
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get published winners for Public view
export const getWinnersPublic = async (req: Request, res: Response) => {
  try {
    const winners = await Winner.find({ isPublished: true })
      .populate('contest_id', 'title bannerImage')
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 });

    // Format output to mask data if showUserDetails is false
    const formattedWinners = winners.map((winner: any) => {
      const winnerObj = winner.toObject();
      if (!winnerObj.showUserDetails) {
        winnerObj.user_id = { name: 'Anonymous', email: '***@***.com' };
      }
      return winnerObj;
    });

    res.status(200).json({
      success: true,
      data: formattedWinners
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update winner (e.g. toggle publish)
export const updateWinner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const winner = await Winner.findByIdAndUpdate(id, updates, { new: true });
    if (!winner) {
      return res.status(404).json({ success: false, message: 'Winner not found' });
    }

    res.status(200).json({
      success: true,
      data: winner,
      message: 'Winner updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete winner
export const deleteWinner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const winner = await Winner.findByIdAndDelete(id);
    if (!winner) {
      return res.status(404).json({ success: false, message: 'Winner not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Winner deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
