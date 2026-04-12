import { z } from 'zod';

export const productReviewParamSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
});

export const addReviewSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
  body: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().trim().min(1, 'Comment is required'),
  }),
});

