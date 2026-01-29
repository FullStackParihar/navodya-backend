import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authenticate = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Authentication token required');
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };

      const user = await User.findById(decoded.userId).select('email name phone avatar role');

      if (!user) {
        throw new ApiError(401, 'Invalid authentication token');
      }

      req.userId = user.id;
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired token');
    }
  }
);

export const requireAdmin = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
      throw new ApiError(403, 'Admin access required');
    }
    next();
  }
);
