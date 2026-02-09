import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { User } from '../models/user.model.js';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password_hash: hashedPassword,
    phone: phone || null,
    role: 'user',
  });

  const token = jwt.sign(
    { userId: user.id },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as SignOptions
  );

  const userResponse = user.toObject();
  delete (userResponse as any).password_hash;

  res.status(201).json(
    new ApiResponse(201, { user: userResponse, token }, 'User registered successfully')
  );
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = jwt.sign(
    { userId: user.id },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as SignOptions
  );

  const userResponse = user.toObject();
  delete (userResponse as any).password_hash;

  res.status(200).json(
    new ApiResponse(200, { user: userResponse, token }, 'Login successful')
  );
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId).select('-password_hash');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(new ApiResponse(200, user, 'Profile retrieved successfully'));
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, phone, avatar, bio, address, city, state, pincode, jnvSchool, batchYear } = req.body;
  const updateData: any = {};

  if (name) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (avatar) updateData.avatar = avatar;
  if (bio !== undefined) updateData.bio = bio;
  if (address !== undefined) updateData.address = address;
  if (city !== undefined) updateData.city = city;
  if (state !== undefined) updateData.state = state;
  if (pincode !== undefined) updateData.pincode = pincode;
  if (jnvSchool !== undefined) updateData.jnvSchool = jnvSchool;
  if (batchYear !== undefined) updateData.batchYear = batchYear;

  const user = await User.findByIdAndUpdate(req.userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password_hash');

  if (!user) {
    throw new ApiError(500, 'Failed to update profile');
  }

  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.status(200).json(new ApiResponse(200, null, 'Logout successful'));
});
