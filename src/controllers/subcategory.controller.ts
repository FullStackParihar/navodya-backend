import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Category } from '../models/category.model.js';
import { Subcategory } from '../models/subcategory.model.js';
import { Product } from '../models/product.model.js';

export const getSubcategories = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId: paramCategoryId } = req.params;
  const { category, categoryId: queryCategoryId, isAdmin: queryIsAdmin } = req.query;

  const isAdmin = (req as any).user?.role === 'admin' || queryIsAdmin === 'true';
  const filter: any = isAdmin ? {} : { isActive: { $ne: false } };

  const targetCategory = paramCategoryId || queryCategoryId || category;

  if (targetCategory) {
    if (mongoose.Types.ObjectId.isValid(String(targetCategory))) {
      filter.categoryId = targetCategory;
    } else {
      const catDoc = await Category.findOne({ slug: String(targetCategory) });
      if (catDoc) {
        filter.categoryId = catDoc._id;
      } else {
        filter.categoryId = null; // category not found -> empty list
      }
    }
  }

  const subcategories = await Subcategory.find(filter)
    .populate('categoryId', 'name slug image')
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  res.status(200).json(new ApiResponse(200, subcategories, 'Subcategories retrieved successfully'));
});

export const getSubcategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug, categorySlug } = req.params;
  const isAdmin = (req as any).user?.role === 'admin' || req.query.isAdmin === 'true';

  let categoryDoc: any = null;
  if (categorySlug) {
    if (mongoose.Types.ObjectId.isValid(categorySlug)) {
      categoryDoc = await Category.findById(categorySlug);
    } else {
      categoryDoc = await Category.findOne({ slug: categorySlug });
    }
  }

  const filter: any = {};
  if (categoryDoc) {
    filter.categoryId = categoryDoc._id;
  }

  if (mongoose.Types.ObjectId.isValid(slug)) {
    filter._id = slug;
  } else {
    filter.slug = slug;
  }

  if (!isAdmin) {
    filter.isActive = { $ne: false };
  }

  const subcategory = await Subcategory.findOne(filter).populate('categoryId', 'name slug image').lean();

  if (!subcategory) {
    throw new ApiError(404, 'Subcategory not found');
  }

  res.status(200).json(new ApiResponse(200, subcategory, 'Subcategory retrieved successfully'));
});

export const createSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId: paramCategoryId } = req.params;
  const { categoryId: bodyCategoryId, name, slug: rawSlug, description, image, imagePublicId, displayOrder, isActive, status, price, salePrice, stock } = req.body;

  const targetCatId = paramCategoryId || bodyCategoryId;
  if (!targetCatId) {
    throw new ApiError(400, 'Parent category ID is required');
  }

  let categoryDoc: any = null;
  if (mongoose.Types.ObjectId.isValid(String(targetCatId))) {
    categoryDoc = await Category.findById(targetCatId);
  } else {
    categoryDoc = await Category.findOne({ slug: String(targetCatId) });
  }

  if (!categoryDoc) {
    throw new ApiError(404, 'Parent category not found');
  }

  if (!name || !name.trim()) {
    throw new ApiError(400, 'Subcategory name is required');
  }

  const cleanSlug = (rawSlug || name)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const existingSubcategory = await Subcategory.findOne({
    categoryId: categoryDoc._id,
    slug: cleanSlug
  });

  if (existingSubcategory) {
    throw new ApiError(400, `Subcategory with slug "${cleanSlug}" already exists in this category`);
  }

  const activeState = isActive !== undefined ? Boolean(isActive) : (status ? status === 'active' : true);
  const numPrice = price !== undefined && price !== '' ? Number(price) : 999;
  const numSalePrice = salePrice !== undefined && salePrice !== '' ? Number(salePrice) : 799;
  const numStock = stock !== undefined && stock !== '' ? Number(stock) : 50;

  const subcategory = await Subcategory.create({
    categoryId: categoryDoc._id,
    name: name.trim(),
    slug: cleanSlug,
    description: description || '',
    image: image || '',
    imagePublicId: imagePublicId || '',
    price: numPrice,
    salePrice: numSalePrice,
    stock: numStock,
    displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
    isActive: activeState
  });

  // Automatically create or link initial Product for this subcategory so it can be added to cart immediately
  try {
    let prodSlug = cleanSlug;
    const existingProd = await Product.findOne({ slug: prodSlug });
    if (existingProd) {
      prodSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }

    await Product.create({
      name: name.trim(),
      slug: prodSlug,
      description: description || `Premium ${name.trim()} gift collection.`,
      price: numPrice,
      sale_price: numSalePrice,
      images: image ? [image] : [],
      category_id: categoryDoc._id,
      subcategory_id: subcategory._id,
      subcategory: name.trim(),
      display_order: displayOrder !== undefined ? Number(displayOrder) : 1,
      is_active: activeState,
      sizes: [{ size: 'Standard', stock: numStock }],
      colors: [{ name: 'Default' }]
    });
  } catch (prodErr) {
    console.error('Note: Could not auto-create product for subcategory:', prodErr);
  }

  const populated = await Subcategory.findById(subcategory._id).populate('categoryId', 'name slug');

  res.status(201).json(new ApiResponse(201, populated, 'Subcategory created successfully'));
});

export const updateSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { categoryId, name, slug: rawSlug, description, image, imagePublicId, displayOrder, isActive, status, price, salePrice, stock } = req.body;

  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    throw new ApiError(404, 'Subcategory not found');
  }

  if (categoryId) {
    let catDoc: any = null;
    if (mongoose.Types.ObjectId.isValid(String(categoryId))) {
      catDoc = await Category.findById(categoryId);
    } else {
      catDoc = await Category.findOne({ slug: String(categoryId) });
    }
    if (!catDoc) throw new ApiError(404, 'Parent category not found');
    subcategory.categoryId = catDoc._id;
  }

  if (name !== undefined) subcategory.name = name.trim();

  if (rawSlug !== undefined && rawSlug.trim()) {
    const cleanSlug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingSubcategory = await Subcategory.findOne({
      categoryId: subcategory.categoryId,
      slug: cleanSlug,
      _id: { $ne: id }
    });
    if (existingSubcategory) {
      throw new ApiError(400, `Subcategory with slug "${cleanSlug}" already exists in this category`);
    }
    subcategory.slug = cleanSlug;
  }

  if (description !== undefined) subcategory.description = description;
  if (image !== undefined) subcategory.image = image;
  if (imagePublicId !== undefined) subcategory.imagePublicId = imagePublicId;
  if (price !== undefined) subcategory.price = Number(price);
  if (salePrice !== undefined) subcategory.salePrice = Number(salePrice);
  if (stock !== undefined) subcategory.stock = Number(stock);
  if (displayOrder !== undefined) subcategory.displayOrder = Number(displayOrder);
  if (isActive !== undefined) subcategory.isActive = Boolean(isActive);
  if (status !== undefined) subcategory.isActive = status === 'active';

  await subcategory.save();

  // Sync associated products if subcategory details changed
  try {
    const productUpdate: any = {};
    if (name !== undefined) productUpdate.subcategory = name.trim();
    if (image !== undefined && image) productUpdate.$addToSet = { images: image };
    if (price !== undefined) productUpdate.price = Number(price);
    if (salePrice !== undefined) productUpdate.sale_price = Number(salePrice);
    if (isActive !== undefined) productUpdate.is_active = Boolean(isActive);

    if (Object.keys(productUpdate).length > 0) {
      await Product.updateMany({ subcategory_id: subcategory._id }, productUpdate);
    }
  } catch (syncErr) {
    console.error('Note: Error syncing product details with subcategory:', syncErr);
  }

  const populated = await Subcategory.findById(subcategory._id).populate('categoryId', 'name slug');

  res.status(200).json(new ApiResponse(200, populated, 'Subcategory updated successfully'));
});

export const updateSubcategoryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    throw new ApiError(404, 'Subcategory not found');
  }

  if (req.body.isActive !== undefined) {
    subcategory.isActive = Boolean(req.body.isActive);
  } else if (req.body.status !== undefined) {
    subcategory.isActive = req.body.status === 'active';
  } else {
    subcategory.isActive = !subcategory.isActive;
  }

  await subcategory.save();

  res.status(200).json(new ApiResponse(200, subcategory, `Subcategory status updated to ${subcategory.isActive ? 'active' : 'inactive'}`));
});

export const deleteSubcategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const subcategory = await Subcategory.findByIdAndDelete(id);
  if (!subcategory) {
    throw new ApiError(404, 'Subcategory not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Subcategory deleted successfully'));
});

