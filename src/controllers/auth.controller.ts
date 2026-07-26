import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { User } from '../models/user.model.js';
import { Otp } from '../models/otp.model.js';
import { sendOtpEmail } from '../utils/email.js';
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
  const { name, email, password, phone, otp } = req.body;

  if (!otp) {
    throw new ApiError(400, 'OTP is required');
  }

  // Find the OTP in the database
  const otpRecord = await Otp.findOne({ email });
  if (!otpRecord || otpRecord.otp !== otp) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }

  // OTP verified, delete it so it can't be reused
  await Otp.deleteOne({ _id: otpRecord._id });

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

export const sendOtp = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email } = req.body;

  // Check if email already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP in database (upsert: delete old ones or overwrite)
  await Otp.findOneAndUpdate(
    { email },
    { otp: otpCode, created_at: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Send the OTP email
  await sendOtpEmail(email, otpCode);

  res.status(200).json(new ApiResponse(200, null, 'OTP sent successfully'));
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

export const googleLogin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token } = req.body;
  if (!token) {
    throw new ApiError(400, 'Google token is required');
  }

  const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
  
  let payload;
  try {
    const response = await (global as any).fetch(googleVerifyUrl);
    if (!response.ok) {
      const errText = await response.text();
      console.error('Google token verification failed:', errText);
      throw new ApiError(400, 'Invalid Google token');
    }
    payload = await response.json();
  } catch (err: any) {
    console.error('Error contacting Google API:', err);
    throw new ApiError(400, err.message || 'Failed to verify Google token');
  }

  const { email, name, picture, email_verified, aud } = payload;

  if (!email_verified || email_verified === 'false' || email_verified === false) {
    throw new ApiError(400, 'Google email is not verified');
  }

  // If a GOOGLE_CLIENT_ID is configured, verify that the audience matches
  if (config.google && config.google.clientId && aud !== config.google.clientId) {
    console.warn(`Token audience mismatch. Expected: ${config.google.clientId}, Got: ${aud}`);
    throw new ApiError(400, 'Invalid token audience');
  }

  // Check if user exists in database
  let user = await User.findOne({ email });

  if (!user) {
    // Register new user since they signed in with Google for the first time
    // Generate a random password hash because password_hash is required
    const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await User.create({
      name: name || 'Google User',
      email,
      password_hash: hashedPassword,
      avatar: picture || null,
      role: 'user',
    });
  } else {
    // Optional: Update user's avatar if they don't have one
    if (!user.avatar && picture) {
      user.avatar = picture;
      await user.save();
    }
  }

  // Generate JWT token for the user
  const sessionToken = jwt.sign(
    { userId: user.id },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as SignOptions
  );

  const userResponse = user.toObject();
  delete (userResponse as any).password_hash;

  res.status(200).json(
    new ApiResponse(200, { user: userResponse, token: sessionToken }, 'Google sign-in successful')
  );
});
