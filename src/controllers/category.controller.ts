import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Category } from '../models/category.model.js';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find().sort({ name: 1 });

  res.status(200).json(new ApiResponse(200, categories, 'Categories retrieved successfully'));
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.status(200).json(new ApiResponse(200, category, 'Category retrieved successfully'));
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, description, image } = req.body;

  const existingCategory = await Category.findOne({ slug });

  if (existingCategory) {
    throw new ApiError(400, 'Category with this slug already exists');
  }

  const category = await Category.create({
    name,
    slug,
    description: description || null,
    image: image || null,
  });

  res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, image } = req.body;

  const updateData: any = {};
  if (name) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (image !== undefined) updateData.image = image;

  const category = await Category.findByIdAndUpdate(id, updateData, { new: true });

  if (!category) {
    throw new ApiError(500, 'Failed to update category');
  }

  res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError(404, 'Category not found'); // Should really be 404 if not found during delete? Mongoose returns null.
  }

  res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
});
