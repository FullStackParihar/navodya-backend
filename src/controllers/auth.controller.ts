import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { User } from '../models/user.model.js';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';

const clean = (value: unknown) => String(value ?? '').trim();
const isValidPhone = (value: string) => !value || /^[+]?\d[\d\s-]{7,14}$/.test(value);
const isValidPincode = (value: string) => !value || /^\d{6}$/.test(value);

const uploadProfileAvatar = (file: Express.Multer.File, userId: string) => {
  if (!isCloudinaryConfigured) {
    throw new ApiError(500, 'Cloudinary is not configured for profile image uploads');
  }

  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'navodaya/profile-avatars',
        public_id: `user-${userId}-${Date.now()}`,
        resource_type: 'image',
        overwrite: false,
      },
      (err, result) => {
        if (err || !result) {
          reject(new ApiError(500, 'Failed to upload profile image'));
          return;
        }
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );

    stream.end(file.buffer);
  });
};

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
  const { name, email, phone, avatar, bio, address, city, state, pincode, jnvSchool, batchYear } = req.body;
  const updateData: any = {};
  const file = req.file as Express.Multer.File | undefined;

  const existingUser = await User.findById(req.userId);
  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }

  const nextName = clean(name);
  const nextEmail = clean(email).toLowerCase();
  const nextPhone = clean(phone);
  const nextPincode = clean(pincode);

  if (name !== undefined) {
    if (nextName.length < 2) throw new ApiError(400, 'Name must be at least 2 characters');
    updateData.name = nextName;
  }

  if (email !== undefined) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) throw new ApiError(400, 'Invalid email address');
    const emailOwner = await User.findOne({ email: nextEmail, _id: { $ne: req.userId } });
    if (emailOwner) throw new ApiError(400, 'Email already registered');
    updateData.email = nextEmail;
  }

  if (phone !== undefined) {
    if (!isValidPhone(nextPhone)) throw new ApiError(400, 'Valid phone number is required');
    updateData.phone = nextPhone;
  }

  if (pincode !== undefined) {
    if (!isValidPincode(nextPincode)) throw new ApiError(400, 'Valid 6-digit pincode is required');
    updateData.pincode = nextPincode;
  }

  if (avatar && !file) updateData.avatar = clean(avatar);
  if (bio !== undefined) updateData.bio = clean(bio);
  if (address !== undefined) updateData.address = clean(address);
  if (city !== undefined) updateData.city = clean(city);
  if (state !== undefined) updateData.state = clean(state);
  if (jnvSchool !== undefined) updateData.jnvSchool = clean(jnvSchool);
  if (batchYear !== undefined) updateData.batchYear = clean(batchYear);

  if (file) {
    const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);
    if (!allowedMimeTypes.has(file.mimetype)) throw new ApiError(400, 'Only JPG, PNG, and WEBP profile images are allowed');
    if (file.size > 5 * 1024 * 1024) throw new ApiError(400, 'Profile image must be 5MB or smaller');

    const uploaded = await uploadProfileAvatar(file, req.userId as string);
    updateData.avatar = uploaded.secure_url;
    updateData.avatar_public_id = uploaded.public_id;
  }

  const user = await User.findByIdAndUpdate(req.userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password_hash');

  if (!user) {
    throw new ApiError(500, 'Failed to update profile');
  }

  if (file && existingUser.avatar_public_id && existingUser.avatar_public_id !== user.avatar_public_id) {
    cloudinary.uploader.destroy(existingUser.avatar_public_id).catch(err => {
      console.error('Failed to remove old profile avatar:', err);
    });
  }

  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.status(200).json(new ApiResponse(200, null, 'Logout successful'));
});
