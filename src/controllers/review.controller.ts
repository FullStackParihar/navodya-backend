import { Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { Review } from '../models/review.model.js';
import { Product } from '../models/product.model.js';
import mongoose from 'mongoose';

export const addReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        throw new ApiError(400, 'Rating and comment are required');
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(400, 'Rating must be between 1 and 5');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    const existingReview = await Review.findOne({
        user_id: req.userId,
        product_id: productId
    });

    if (existingReview) {
        throw new ApiError(400, 'You have already reviewed this product');
    }

    const review = await Review.create({
        user_id: req.userId,
        product_id: productId,
        rating,
        comment
    });

    // Update Product Rating logic
    const stats = await Review.aggregate([
        { $match: { product_id: new mongoose.Types.ObjectId(productId) } },
        {
            $group: {
                _id: '$product_id',
                avgRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        product.rating = stats[0].avgRating;
        product.review_count = stats[0].numReviews;
    } else {
        product.rating = rating;
        product.review_count = 1;
    }

    await product.save();

    res.status(201).json(
        new ApiResponse(201, review, 'Review added successfully')
    );
});

export const getProductReviews = asyncHandler(async (req: any, res: Response) => {
    const { productId } = req.params;

    const reviews = await Review.find({ product_id: productId })
        .populate('user_id', 'name')
        .sort({ created_at: -1 });

    res.status(200).json(
        new ApiResponse(200, reviews, 'Reviews retrieved successfully')
    );
});
