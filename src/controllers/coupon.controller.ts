import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Coupon } from '../models/coupon.model.js';

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { code, type, value, minOrderAmount, maxDiscountAmount, validUntil, usageLimit } = req.body;

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (existingCoupon) {
        throw new ApiError(400, 'Coupon with this code already exists');
    }

    const coupon = await Coupon.create({
        code,
        type,
        value,
        min_order_amount: minOrderAmount,
        max_discount_amount: maxDiscountAmount,
        valid_until: validUntil,
        usage_limit: usageLimit
    });

    res.status(201).json(new ApiResponse(201, coupon, 'Coupon created successfully'));
});

export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { code, orderAmount } = req.body;

    if (!code) {
        throw new ApiError(400, 'Coupon code is required');
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
        throw new ApiError(404, 'Invalid coupon code');
    }

    if (!coupon.isValid()) {
        throw new ApiError(400, 'Coupon is expired or inactive');
    }

    if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
        throw new ApiError(400, `Minimum order amount of ${coupon.min_order_amount} required`);
    }

    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
        discount = (orderAmount * coupon.value) / 100;
        if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
            discount = coupon.max_discount_amount;
        }
    } else {
        discount = coupon.value;
    }

    // Ensure discount doesn't exceed order amount
    if (discount > orderAmount) {
        discount = orderAmount;
    }

    res.status(200).json(new ApiResponse(200, {
        couponCode: coupon.code,
        discountAmount: discount,
        message: 'Coupon applied successfully'
    }, 'Coupon valid'));
});

export const getAllCoupons = asyncHandler(async (req: Request, res: Response) => {
    const coupons = await Coupon.find({}).sort({ created_at: -1 });
    res.status(200).json(new ApiResponse(200, coupons, 'Coupons retrieved successfully'));
});
