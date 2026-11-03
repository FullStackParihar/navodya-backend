import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Category } from '../models/category.model.js';
import { Subcategory } from '../models/subcategory.model.js';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = (req as any).user?.role === 'admin' || req.query.isAdmin === 'true';
  const filter: any = isAdmin ? {} : { isActive: { $ne: false } };

  // Fetch categories sorted by displayOrder (ascending) then name
  const categories = await Category.find(filter)
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  // Populate subcategories for each category
  const subFilter: any = isAdmin ? {} : { isActive: { $ne: false } };
  const categoryIds = categories.map((cat) => cat._id);

  const subcategories = await Subcategory.find({
    categoryId: { $in: categoryIds },
    ...subFilter
  })
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  const subcategoryMap = new Map<string, any[]>();
  for (const sub of subcategories) {
    const key = String(sub.categoryId);
    if (!subcategoryMap.has(key)) {
      subcategoryMap.set(key, []);
    }
    subcategoryMap.get(key)!.push(sub);
  }

  const enrichedCategories = categories.map((cat) => ({
    ...cat,
    subcategories: subcategoryMap.get(String(cat._id)) || []
  }));

  res.status(200).json(new ApiResponse(200, enrichedCategories, 'Categories retrieved successfully'));
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const isAdmin = (req as any).user?.role === 'admin' || req.query.isAdmin === 'true';

  let category: any = null;
  if (mongoose.Types.ObjectId.isValid(slug)) {
    category = await Category.findById(slug).lean();
  }
  if (!category) {
    category = await Category.findOne({ slug }).lean();
  }

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (!isAdmin && category.isActive === false) {
    throw new ApiError(404, 'Category is not active');
  }

  const subFilter: any = { categoryId: category._id };
  if (!isAdmin) {
    subFilter.isActive = { $ne: false };
  }

  const subcategories = await Subcategory.find(subFilter)
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  category.subcategories = subcategories;

  res.status(200).json(new ApiResponse(200, category, 'Category retrieved successfully'));
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug: rawSlug, description, image, imagePublicId, displayOrder, isActive, status } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, 'Category name is required');
  }

  const cleanSlug = (rawSlug || name)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const existingCategory = await Category.findOne({ slug: cleanSlug });
  if (existingCategory) {
    throw new ApiError(400, 'Category with this slug already exists');
  }

  const activeState = isActive !== undefined ? Boolean(isActive) : (status ? status === 'active' : true);

  const category = await Category.create({
    name: name.trim(),
    slug: cleanSlug,
    description: description || '',
    image: image || '',
    imagePublicId: imagePublicId || '',
    displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
    isActive: activeState
  });

  res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug: rawSlug, description, image, imagePublicId, displayOrder, isActive, status } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (name !== undefined) category.name = name.trim();
  if (rawSlug !== undefined && rawSlug.trim()) {
    const cleanSlug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingCategory = await Category.findOne({ slug: cleanSlug, _id: { $ne: id } });
    if (existingCategory) {
      throw new ApiError(400, 'Category with this slug already exists');
    }
    category.slug = cleanSlug;
  }
  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;
  if (imagePublicId !== undefined) category.imagePublicId = imagePublicId;
  if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);
  if (isActive !== undefined) category.isActive = Boolean(isActive);
  if (status !== undefined) category.isActive = status === 'active';

  await category.save();

  res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
});

export const updateCategoryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (req.body.isActive !== undefined) {
    category.isActive = Boolean(req.body.isActive);
  } else if (req.body.status !== undefined) {
    category.isActive = req.body.status === 'active';
  } else {
    category.isActive = !category.isActive;
  }

  await category.save();

  res.status(200).json(new ApiResponse(200, category, `Category status updated to ${category.isActive ? 'active' : 'inactive'}`));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Delete associated subcategories so no orphans remain
  await Subcategory.deleteMany({ categoryId: id });

  res.status(200).json(new ApiResponse(200, null, 'Category and its subcategories deleted successfully'));
});
