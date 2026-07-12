import { Request, Response } from 'express';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import Banner from '../models/banner.model.js';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const text = (value: unknown, max: number, field: string, required = false) => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') throw new ApiError(400, `${field} must be text`);
  const clean = value.trim();
  if (required && !clean) throw new ApiError(400, `${field} is required`);
  if (clean.length > max) throw new ApiError(400, `${field} must be at most ${max} characters`);
  return clean;
};

const parseDate = (value: unknown, field: string) => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) throw new ApiError(400, `${field} is invalid`);
  if (field === 'End date' && /^\d{4}-\d{2}-\d{2}$/.test(String(value))) date.setUTCHours(23, 59, 59, 999);
  return date;
};

const bannerInput = (body: Record<string, unknown>, creating = false) => {
  const data: Record<string, unknown> = {};
  const imageUrl = text(body.imageUrl, 1000, 'Image URL', creating);
  const imagePublicId = text(body.imagePublicId, 500, 'Image public ID', creating);
  const title = text(body.title, 120, 'Title', creating);
  const subtitle = text(body.subtitle, 300, 'Subtitle');
  const offerText = text(body.offerText, 100, 'Offer text');
  const buttonText = text(body.buttonText, 50, 'Button text');
  const buttonLink = text(body.buttonLink, 500, 'Button link');
  if (imageUrl !== undefined) {
    if (!/^(https?:\/\/|\/uploads\/)/i.test(imageUrl)) throw new ApiError(400, 'Image URL is invalid');
    data.imageUrl = imageUrl;
  }
  if (imagePublicId !== undefined) data.imagePublicId = imagePublicId;
  if (title !== undefined) data.title = title;
  if (subtitle !== undefined) data.subtitle = subtitle;
  if (offerText !== undefined) data.offerText = offerText;
  if (buttonText !== undefined) data.buttonText = buttonText;
  if (buttonLink !== undefined) {
    if (buttonLink && !/^(https?:\/\/|\/|#)/i.test(buttonLink)) throw new ApiError(400, 'Button link must be a site path or HTTP(S) URL');
    data.buttonLink = buttonLink;
  }
  if (body.displayOrder !== undefined) {
    const order = Number(body.displayOrder);
    if (!Number.isInteger(order) || order < 0 || order > 100000) throw new ApiError(400, 'Display order must be a non-negative integer');
    data.displayOrder = order;
  }
  if (body.isActive !== undefined) {
    if (typeof body.isActive !== 'boolean') throw new ApiError(400, 'Status must be a boolean');
    data.isActive = body.isActive;
  }
  const startDate = parseDate(body.startDate, 'Start date');
  const endDate = parseDate(body.endDate, 'End date');
  if (startDate !== undefined) data.startDate = startDate;
  if (endDate !== undefined) data.endDate = endDate;
  if (startDate && endDate && startDate > endDate) throw new ApiError(400, 'End date must be on or after start date');
  return data;
};

const removeAsset = async (publicId?: string) => {
  if (!publicId) return;
  try {
    if (isCloudinaryConfigured) await cloudinary.uploader.destroy(publicId);
    else {
      const safeName = path.basename(publicId);
      await fs.unlink(path.join(process.cwd(), 'uploads', safeName));
    }
  } catch (error: any) {
    if (error?.code !== 'ENOENT') console.error('Banner asset cleanup failed:', error);
  }
};

export const getActiveBanners = asyncHandler(async (_req: Request, res: Response) => {
  const now = new Date();
  const banners = await Banner.find({
    isActive: true,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $exists: false } }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gte: now } }] },
    ],
  }).sort({ displayOrder: 1, createdAt: 1 });
  res.json(new ApiResponse(200, banners, 'Active banners retrieved successfully'));
});

export const getAdminBanners = asyncHandler(async (_req: Request, res: Response) => {
  const banners = await Banner.find().select('+imagePublicId').sort({ displayOrder: 1, createdAt: 1 });
  res.json(new ApiResponse(200, banners, 'Banners retrieved successfully'));
});

export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await Banner.create(bannerInput(req.body, true));
  res.status(201).json(new ApiResponse(201, banner, 'Banner created successfully'));
});

export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'Invalid banner ID');
  const current = await Banner.findById(req.params.id).select('+imagePublicId');
  if (!current) throw new ApiError(404, 'Banner not found');
  const update = bannerInput(req.body);
  const start = update.startDate !== undefined ? update.startDate : current.startDate;
  const end = update.endDate !== undefined ? update.endDate : current.endDate;
  if (start && end && (start as Date) > (end as Date)) throw new ApiError(400, 'End date must be on or after start date');
  const oldAsset = update.imagePublicId && update.imagePublicId !== current.imagePublicId ? current.imagePublicId : undefined;
  Object.assign(current, update);
  await current.save();
  await removeAsset(oldAsset);
  res.json(new ApiResponse(200, current, 'Banner updated successfully'));
});

export const updateBannerStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'Invalid banner ID');
  if (typeof req.body.isActive !== 'boolean') throw new ApiError(400, 'Status must be a boolean');
  const banner = await Banner.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true, runValidators: true }).select('+imagePublicId');
  if (!banner) throw new ApiError(404, 'Banner not found');
  res.json(new ApiResponse(200, banner, `Banner ${banner.isActive ? 'activated' : 'deactivated'}`));
});

export const reorderBanners = asyncHandler(async (req: Request, res: Response) => {
  if (!Array.isArray(req.body.items) || req.body.items.length === 0) throw new ApiError(400, 'Reorder items are required');
  const ids = new Set<string>();
  const operations = req.body.items.map((item: any) => {
    if (!mongoose.isValidObjectId(item?.id) || ids.has(item.id)) throw new ApiError(400, 'Reorder contains an invalid or duplicate banner ID');
    const displayOrder = Number(item.displayOrder);
    if (!Number.isInteger(displayOrder) || displayOrder < 0) throw new ApiError(400, 'Display order must be a non-negative integer');
    ids.add(item.id);
    return { updateOne: { filter: { _id: item.id }, update: { displayOrder } } };
  });
  await Banner.bulkWrite(operations);
  const banners = await Banner.find().select('+imagePublicId').sort({ displayOrder: 1, createdAt: 1 });
  res.json(new ApiResponse(200, banners, 'Banners reordered successfully'));
});

export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'Invalid banner ID');
  const banner = await Banner.findByIdAndDelete(req.params.id).select('+imagePublicId');
  if (!banner) throw new ApiError(404, 'Banner not found');
  await removeAsset(banner.imagePublicId);
  res.json(new ApiResponse(200, null, 'Banner deleted successfully'));
});
