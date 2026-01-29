import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Product } from '../models/product.model.js';
import { Category } from '../models/category.model.js';
import mongoose from 'mongoose';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    subcategory,
    minPrice,
    maxPrice,
    size,
    color,
    tags,
    search,
    sort = 'created_at',
    order = 'desc',
    page = '1',
    limit = '20',
  } = req.query;

  const filter: any = { is_active: true };

  if (category) {
    const catDoc = await Category.findOne({ slug: category as string });
    if (catDoc) {
      filter.category_id = catDoc._id;
    } else {
      // If category slug provided but not found, return empty or handle?
      // For now, if category not found, strict filtering means no products match.
      filter.category_id = null;
    }
  }

  if (subcategory) {
    filter.subcategory = subcategory;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
  }

  if (search) {
    const searchRegex = { $regex: search as string, $options: 'i' };
    filter.$or = [
      { name: searchRegex },
      { description: searchRegex }
    ];
  }

  if (tags) {
    const tagsArray = (tags as string).split(',');
    filter.tags = { $in: tagsArray };
  }

  // Filter by size and color in DB
  if (size) {
    filter.sizes = { $elemMatch: { size: size, stock: { $gt: 0 } } };
  }

  if (color) {
    filter.colors = { $elemMatch: { name: { $regex: new RegExp(color as string, 'i') } } };
  }

  const sortOption: any = {};
  if (sort === 'price_asc') {
    sortOption.price = 1;
  } else if (sort === 'price_desc') {
    sortOption.price = -1;
  } else {
    sortOption[sort as string] = order === 'asc' ? 1 : -1;
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category_id', 'name slug')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Products retrieved successfully'
    )
  );
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug, is_active: true }).populate('category_id', 'name slug');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json(new ApiResponse(200, product, 'Product retrieved successfully'));
});



export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    slug,
    description,
    price,
    salePrice,
    images,
    categoryId,
    subcategory,
    sizes,
    colors,
    tags,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, 'Invalid categoryId format. Must be a valid MongoDB ObjectId');
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const existingProduct = await Product.findOne({ slug });

  if (existingProduct) {
    throw new ApiError(400, 'Product with this slug already exists');
  }

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    sale_price: salePrice,
    images,
    category_id: categoryId,
    subcategory,
    sizes,
    colors,
    tags: tags || [],
  });

  res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: any = { ...req.body };

  if (updateData.categoryId) {
    updateData.category_id = updateData.categoryId;
    delete updateData.categoryId;
  }
  if (updateData.salePrice !== undefined) {
    updateData.sale_price = updateData.salePrice;
    delete updateData.salePrice;
  }
  if (updateData.isActive !== undefined) {
    updateData.is_active = updateData.isActive;
    delete updateData.isActive;
  }

  const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});
