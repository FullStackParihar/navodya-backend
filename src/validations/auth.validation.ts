import { z } from 'zod';

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}, z.string().optional());

const optionalNameString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}, z.string().min(2, 'Name must be at least 2 characters').optional());

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: optionalNameString,
    phone: optionalTrimmedString,
    avatar: z.preprocess((value) => {
      if (typeof value !== 'string') {
        return value;
      }

      const trimmed = value.trim();
      return trimmed === '' ? undefined : trimmed;
    }, z.string().url('Invalid avatar URL').optional()),
    bio: optionalTrimmedString,
    address: optionalTrimmedString,
    city: optionalTrimmedString,
    state: optionalTrimmedString,
    pincode: optionalTrimmedString,
    jnvSchool: optionalTrimmedString,
    batchYear: optionalTrimmedString,
  }),
});
