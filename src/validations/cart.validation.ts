import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be at least 1').default(1),
    size: z.string().min(1, 'Size is required'),
    color: z.string().min(1, 'Color is required'),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive('Quantity must be at least 1'),
  }),
});
