import { z } from 'zod';

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().trim().min(1, 'Coupon code is required'),
    type: z.enum(['PERCENTAGE', 'FIXED']),
    value: z.number().positive('Coupon value must be positive'),
    minOrderAmount: z.number().nonnegative().optional(),
    maxDiscountAmount: z.number().positive().optional(),
    validUntil: z.string().datetime('validUntil must be a valid ISO date'),
    usageLimit: z.number().int().positive().optional(),
  }),
});

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().trim().min(1, 'Coupon code is required'),
    orderAmount: z.number().nonnegative('Order amount must be non-negative'),
  }),
});

export const couponIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid coupon ID'),
  }),
});

