import { z } from 'zod';

const optionalNonEmptyString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}, z.string().min(1).optional());

const paymentMethodSchema = z.preprocess((value) => {
  if (value === 'online') {
    return 'card';
  }

  return value;
}, z.enum(['card', 'cod']).default('card'));

const shippingAddressSchema = z.object({
  fullName: optionalNonEmptyString,
  name: optionalNonEmptyString,
  firstName: optionalNonEmptyString,
  lastName: z.string().optional(),
  phone: z.string().trim().min(1, 'Phone is required'),
  addressLine: optionalNonEmptyString,
  address: optionalNonEmptyString,
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  pincode: optionalNonEmptyString,
  zip_code: optionalNonEmptyString,
  country: optionalNonEmptyString,
}).superRefine((data, ctx) => {
  if (!data.fullName && !data.name && !data.firstName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Recipient name is required',
    });
  }

  if (!data.addressLine && !data.address) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Address is required',
    });
  }

  if (!data.pincode && !data.zip_code) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Pincode is required',
    });
  }
});

export const createPaymentIntentSchema = z.object({
  body: z.object({
    couponCode: optionalNonEmptyString,
    paymentMethod: paymentMethodSchema,
    shippingAddress: shippingAddressSchema.optional(),
  }),
});

export const createOrderSchema = z.object({
  body: z.object({
    paymentIntentId: optionalNonEmptyString,
    paymentMethod: paymentMethodSchema,
    couponCode: optionalNonEmptyString,
    shippingAddress: shippingAddressSchema,
  }).superRefine((data, ctx) => {
    if (data.paymentMethod !== 'cod' && !data.paymentIntentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Payment Intent ID is required for card payments',
        path: ['paymentIntentId'],
      });
    }
  }),
});

export const orderIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID'),
  }),
});
