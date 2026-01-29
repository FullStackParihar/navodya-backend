import { Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { Favorite } from '../models/favorite.model.js';
import { Product, IProduct } from '../models/product.model.js';

export const getFavorites = asyncHandler(async (req: AuthRequest, res: Response) => {
  const favorites = await Favorite.find({ user_id: req.userId })
    .populate('product_id')
    .sort({ created_at: -1 });

  const activeProducts = favorites.filter((fav) => {
    const product = fav.product_id as unknown as IProduct;
    return product && product.is_active;
  }).map(fav => {
    // Transform to include 'products' key if needed or assume frontend handles product_id
    // To match previous:
    const product = fav.product_id as unknown as IProduct;
    const favObj = fav.toObject();
    return {
      ...favObj,
      products: product,
      product_id: product?._id || fav.product_id
    };
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        favorites: activeProducts,
        count: activeProducts.length,
      },
      'Favorites retrieved successfully'
    )
  );
});

export const toggleFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId, is_active: true });

  if (!product) {
    throw new ApiError(404, 'Product not found or not available');
  }

  const existingFavorite = await Favorite.findOne({
    user_id: req.userId,
    product_id: productId,
  });

  if (existingFavorite) {
    await Favorite.findByIdAndDelete(existingFavorite._id);

    return res.status(200).json(
      new ApiResponse(200, { isFavorite: false }, 'Removed from favorites successfully')
    );
  } else {
    const favorite = await Favorite.create({
      user_id: req.userId,
      product_id: productId,
    });

    const populatedFavorite = await Favorite.findById(favorite._id).populate('product_id');
    const favObj = populatedFavorite?.toObject();
    if (favObj) {
      (favObj as any).products = favObj.product_id;
    }

    return res.status(201).json(
      new ApiResponse(201, { isFavorite: true, favorite: favObj }, 'Added to favorites successfully')
    );
  }
});

export const removeFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;

  await Favorite.findOneAndDelete({
    user_id: req.userId,
    product_id: productId
  });

  res.status(200).json(new ApiResponse(200, null, 'Removed from favorites successfully'));
});

export const checkFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;

  const favorite = await Favorite.findOne({
    user_id: req.userId,
    product_id: productId,
  });

  res.status(200).json(
    new ApiResponse(200, { isFavorite: !!favorite }, 'Favorite status retrieved successfully')
  );
});
