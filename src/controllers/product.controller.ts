import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Product } from '../models/product.model.js';
import { Category } from '../models/category.model.js';
import { CartItem } from '../models/cartItem.model.js';
import { Favorite } from '../models/favorite.model.js';
import mongoose from 'mongoose';

const clothingCategoryPattern = /(t[\s-]?shirts?|hoodies?|polos?|jackets?|shirts?|sweatshirts?|clothing|apparel|wear)/i;

const isClothingCategory = (category: any) => (
  clothingCategoryPattern.test(`${category?.name || ''} ${category?.slug || ''}`)
);

const normalizeFabricVariants = (variants: any, category: any, mainPrice: any, mainSalePrice: any, existingVariants: any[] = []) => {
  const suppliedVariants = variants === undefined ? existingVariants : variants;
  if (!Array.isArray(suppliedVariants)) throw new ApiError(400, 'Fabric variants must be an array');
  if (suppliedVariants.length > 0 && !isClothingCategory(category)) {
    throw new ApiError(400, 'Fabric variants are only available for clothing categories');
  }
  if (!isClothingCategory(category)) return [];

  const names = new Set<string>();
  const normalized = suppliedVariants.map((variant: any) => {
    const name = String(variant?.name || '').trim();
    const key = name.toLowerCase();
    const isCotton = key === 'cotton';
    const price = Number(isCotton ? mainPrice : variant?.price);
    const rawSalePrice = isCotton ? mainSalePrice : (variant?.salePrice ?? variant?.sale_price);
    const salePrice = rawSalePrice === undefined || rawSalePrice === null || rawSalePrice === '' ? undefined : Number(rawSalePrice);
    if (!name) throw new ApiError(400, 'Fabric name is required');
    if (names.has(key)) throw new ApiError(400, `Duplicate fabric option: ${name}`);
    if (!Number.isFinite(price) || price < 0) throw new ApiError(400, `A non-negative price is required for ${name}`);
    if (salePrice !== undefined && (!Number.isFinite(salePrice) || salePrice < 0 || salePrice >= price)) {
      throw new ApiError(400, `Sale price for ${name} must be non-negative and less than its regular price`);
    }
    if (variant.stock !== undefined && variant.stock !== '' && (!Number.isInteger(Number(variant.stock)) || Number(variant.stock) < 0)) {
      throw new ApiError(400, `Stock for ${name} must be a non-negative whole number`);
    }
    names.add(key);
    return {
      ...(variant._id && mongoose.Types.ObjectId.isValid(variant._id) ? { _id: variant._id } : {}),
      name,
      price,
      ...(salePrice !== undefined ? { sale_price: salePrice } : {}),
      ...(variant.stock !== undefined && variant.stock !== '' ? { stock: Number(variant.stock) } : {}),
      ...(String(variant.sku || '').trim() ? { sku: String(variant.sku).trim() } : {}),
      is_active: isCotton ? true : variant.is_active !== false,
    };
  });

  if (!names.has('cotton')) {
    const existingCotton = existingVariants.find((variant: any) => String(variant?.name || '').trim().toLowerCase() === 'cotton');
    normalized.unshift({
      ...(existingCotton?._id ? { _id: existingCotton._id } : {}),
      name: 'Cotton',
      price: Number(mainPrice),
      ...(mainSalePrice !== undefined && mainSalePrice !== null && mainSalePrice !== '' ? { sale_price: Number(mainSalePrice) } : {}),
      ...(existingCotton?.stock !== undefined ? { stock: existingCotton.stock } : {}),
      ...(existingCotton?.sku ? { sku: existingCotton.sku } : {}),
      is_active: true,
    });
  }
  return normalized;
};

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

  const isAdmin = (req as any).user?.role === 'admin';
  const filter: any = isAdmin ? {} : { is_active: true };

  const { excludeAlumniKits } = req.query;
  if (excludeAlumniKits === 'true') {
    const akCat = await Category.findOne({ slug: 'alumni-kit' });
    if (akCat) {
      filter.category_id = { $ne: akCat._id };
    }
  }

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
    specifications,
    fabricVariants,
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
    specifications,
    fabric_variants: normalizeFabricVariants(fabricVariants, category, price, salePrice),
  });

  res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: any = { ...req.body };

  const existingProduct = await Product.findById(id);
  if (!existingProduct) throw new ApiError(404, 'Product not found');

  const categoryId = updateData.categoryId || existingProduct.category_id;
  if (!mongoose.Types.ObjectId.isValid(String(categoryId))) throw new ApiError(400, 'Invalid categoryId format');
  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(404, 'Category not found');

  const nextPrice = updateData.price !== undefined ? updateData.price : existingProduct.price;
  const nextSalePrice = updateData.salePrice !== undefined ? updateData.salePrice : existingProduct.sale_price;

  if (updateData.fabricVariants !== undefined || isClothingCategory(category)) {
    updateData.fabric_variants = normalizeFabricVariants(
      updateData.fabricVariants,
      category,
      nextPrice,
      nextSalePrice,
      existingProduct.fabric_variants || []
    );
    delete updateData.fabricVariants;
  } else if (!isClothingCategory(category) && existingProduct.fabric_variants?.length) {
    throw new ApiError(400, 'Remove fabric variants before changing to a non-clothing category');
  }

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

  const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

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

  // Delete product from all user carts and wishlists/favorites
  await CartItem.deleteMany({ product_id: id });
  await Favorite.deleteMany({ product_id: id });

  res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});
