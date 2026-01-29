import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be positive'),
    salePrice: z.number().positive().optional(),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
    subcategory: z.string().optional(),
    sizes: z.array(
      z.object({
        size: z.string(),
        stock: z.number().int().nonnegative(),
      })
    ),
    colors: z.array(
      z.object({
        name: z.string(),
        hex: z.string(),
        images: z.array(z.string().url()),
      })
    ),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    salePrice: z.number().positive().optional(),
    images: z.array(z.string().url()).optional(),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID').optional(),
    subcategory: z.string().optional(),
    sizes: z.array(
      z.object({
        size: z.string(),
        stock: z.number().int().nonnegative(),
      })
    ).optional(),
    colors: z.array(
      z.object({
        name: z.string(),
        hex: z.string(),
        images: z.array(z.string().url()),
      })
    ).optional(),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});
