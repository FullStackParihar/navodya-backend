import mongoose from 'mongoose';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { Order } from '../models/order.model.js';
import { CartItem } from '../models/cartItem.model.js';
import { Coupon, ICoupon } from '../models/coupon.model.js';
import { Product, IProduct } from '../models/product.model.js';
import { config } from '../config/env.js';

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: 'latest' as any,
});

type CheckoutContext = {
  items: Array<{
    product: IProduct;
    cartItemId: string;
    quantity: number;
    size: string;
    color: string;
  }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponId?: mongoose.Types.ObjectId;
  couponCode?: string;
  orderItems: Array<{
    product_id: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }>;
};

const MOCK_PREFIX = 'mock_';

const normalizeCouponCode = (couponCode?: string) => couponCode?.trim().toUpperCase() || '';

const isNonProduction = config.nodeEnv !== 'production';

const mapShippingAddress = (shippingAddress: any) => ({
  name:
    shippingAddress.fullName ||
    shippingAddress.name ||
    (shippingAddress.firstName
      ? `${shippingAddress.firstName} ${shippingAddress.lastName || ''}`.trim()
      : 'N/A'),
  phone: shippingAddress.phone || 'N/A',
  street: shippingAddress.addressLine || shippingAddress.address || 'N/A',
  city: shippingAddress.city || 'N/A',
  state: shippingAddress.state || 'N/A',
  zip_code: shippingAddress.pincode || shippingAddress.zip_code || 'N/A',
  country: shippingAddress.country || 'India',
});

const calculateDiscount = (coupon: ICoupon | null, subtotal: number) => {
  if (!coupon) {
    return 0;
  }

  if (!coupon.isValid()) {
    throw new ApiError(400, 'Coupon is expired or inactive');
  }

  if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
    throw new ApiError(400, `Minimum order amount of ${coupon.min_order_amount} required`);
  }

  let discount = 0;
  if (coupon.type === 'PERCENTAGE') {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
      discount = coupon.max_discount_amount;
    }
  } else {
    discount = coupon.value;
  }

  return Math.min(discount, subtotal);
};

const buildCheckoutContext = async (
  userId: string,
  couponCode?: string,
  session?: mongoose.ClientSession
): Promise<CheckoutContext> => {
  const cartItems = await CartItem.find({ user_id: new mongoose.Types.ObjectId(userId) }).session(session || null);

  if (cartItems.length === 0) {
    throw new ApiError(400, 'Your cart is empty. Please add items to your cart before proceeding to checkout.');
  }

  const productIds = cartItems.map((item) => item.product_id);
  const products = await Product.find({ _id: { $in: productIds }, is_active: true }).session(session || null);
  const productMap = new Map(products.map((product) => [String(product._id), product]));

  const items: CheckoutContext['items'] = [];
  const orderItems: CheckoutContext['orderItems'] = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const product = productMap.get(String(item.product_id));

    if (!product) {
      throw new ApiError(400, 'Your cart contains unavailable items. Please update your cart and try again.');
    }

    const sizeData = product.sizes.find((size) => size.size === item.size);
    if (!sizeData) {
      throw new ApiError(400, `Selected size is no longer available for ${product.name}`);
    }

    if (sizeData.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name} (Size: ${item.size})`);
    }

    const price = product.sale_price || product.price;
    subtotal += price * item.quantity;

    items.push({
      product,
      cartItemId: String(item._id),
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    });

    orderItems.push({
      product_id: product._id as mongoose.Types.ObjectId,
      name: product.name,
      image: product.images[0] || '',
      price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    });
  }

  const normalizedCouponCode = normalizeCouponCode(couponCode);
  let coupon: ICoupon | null = null;

  if (normalizedCouponCode) {
    coupon = await Coupon.findOne({ code: normalizedCouponCode }).session(session || null);
    if (!coupon) {
      throw new ApiError(404, 'Invalid coupon code');
    }
  }

  const discount = calculateDiscount(coupon, subtotal);
  const shippingFee = 0;
  const tax = 0;
  const total = subtotal - discount + shippingFee + tax;

  return {
    items,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    couponId: coupon?._id as mongoose.Types.ObjectId | undefined,
    couponCode: normalizedCouponCode || undefined,
    orderItems,
  };
};

const createMockPaymentIntentToken = (userId: string, amount: number, couponCode?: string) =>
  `${MOCK_PREFIX}${jwt.sign(
    {
      purpose: 'mock_checkout',
      userId,
      amount,
      couponCode: normalizeCouponCode(couponCode),
    },
    config.jwt.secret,
    { expiresIn: '15m' }
  )}`;

const verifyMockPaymentIntentToken = (paymentIntentId: string, userId: string, amount: number) => {
  if (!paymentIntentId.startsWith(MOCK_PREFIX)) {
    throw new ApiError(400, 'Invalid mock payment token');
  }

  const token = paymentIntentId.slice(MOCK_PREFIX.length);
  const decoded = jwt.verify(token, config.jwt.secret) as {
    purpose: string;
    userId: string;
    amount: number;
    couponCode?: string;
  };

  if (decoded.purpose !== 'mock_checkout' || decoded.userId !== userId || decoded.amount !== amount) {
    throw new ApiError(400, 'Mock payment token verification failed');
  }

  return decoded;
};

const verifyPayment = async (
  req: AuthRequest,
  paymentMethod: 'card' | 'cod',
  paymentIntentId: string | undefined,
  checkout: CheckoutContext
) => {
  if (paymentMethod === 'cod') {
    return {
      paymentInfo: {
        id: `cod_${Date.now()}`,
        status: 'PENDING' as const,
        method: 'cod',
      },
      couponCode: checkout.couponCode,
    };
  }

  if (!paymentIntentId) {
    throw new ApiError(400, 'Payment Intent ID is required');
  }

  const expectedAmount = Math.round(checkout.total * 100);

  if (paymentIntentId.startsWith(MOCK_PREFIX)) {
    if (!isNonProduction) {
      throw new ApiError(400, 'Mock payments are not allowed in production');
    }

    const decoded = verifyMockPaymentIntentToken(paymentIntentId, req.userId!, expectedAmount);
    return {
      paymentInfo: {
        id: paymentIntentId,
        status: 'PAID' as const,
        method: 'card',
      },
      couponCode: normalizeCouponCode(decoded.couponCode),
    };
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    throw new ApiError(400, 'Payment not successful');
  }

  if (paymentIntent.metadata.userId !== req.userId) {
    throw new ApiError(403, 'Payment intent does not belong to the authenticated user');
  }

  if (paymentIntent.amount !== expectedAmount) {
    throw new ApiError(400, 'Payment amount does not match the current cart total');
  }

  return {
    paymentInfo: {
      id: paymentIntent.id,
      status: 'PAID' as const,
      method: paymentIntent.payment_method_types[0] || 'card',
    },
    couponCode: normalizeCouponCode(paymentIntent.metadata.couponCode),
  };
};

export const createPaymentIntent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const paymentMethod = (req.body.paymentMethod || 'card') as 'card' | 'cod';
  const { couponCode } = req.body;

  const checkout = await buildCheckoutContext(req.userId!, couponCode);

  if (paymentMethod === 'cod') {
    return res.status(200).json(new ApiResponse(200, {
      paymentIntentId: null,
      pricing: {
        subtotal: checkout.subtotal,
        discount: checkout.discount,
        shippingFee: checkout.shippingFee,
        tax: checkout.tax,
        total: checkout.total,
      },
      paymentMethod: 'cod',
    }, 'Cash on delivery checkout validated'));
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(checkout.total * 100),
      currency: 'inr',
      metadata: {
        userId: req.userId as string,
        couponCode: checkout.couponCode || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json(new ApiResponse(200, {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      pricing: {
        subtotal: checkout.subtotal,
        discount: checkout.discount,
        shippingFee: checkout.shippingFee,
        tax: checkout.tax,
        total: checkout.total,
      },
    }, 'Payment intent created'));
  } catch (error: any) {
    if (
      isNonProduction &&
      (error.type === 'StripeAuthenticationError' ||
        error.message?.includes('Invalid API Key') ||
        config.stripe.secretKey.startsWith('sk_test_placeholder'))
    ) {
      return res.status(200).json(new ApiResponse(200, {
        clientSecret: 'mock_secret_for_testing',
        paymentIntentId: createMockPaymentIntentToken(req.userId!, Math.round(checkout.total * 100), checkout.couponCode),
        pricing: {
          subtotal: checkout.subtotal,
          discount: checkout.discount,
          shippingFee: checkout.shippingFee,
          tax: checkout.tax,
          total: checkout.total,
        },
        isTestMode: true,
      }, 'Payment intent created (Mock Mode)'));
    }

    throw error;
  }
});

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const paymentMethod = (req.body.paymentMethod || 'card') as 'card' | 'cod';
  const { paymentIntentId, shippingAddress, couponCode } = req.body;

  if (paymentMethod !== 'cod' && paymentIntentId) {
    const existingOrder = await Order.findOne({ 'payment_info.id': paymentIntentId });
    if (existingOrder) {
      return res.status(200).json(new ApiResponse(200, existingOrder, 'Order already exists'));
    }
  }

  const preflightCheckout = await buildCheckoutContext(req.userId!, couponCode);
  const verifiedPayment = await verifyPayment(req, paymentMethod, paymentIntentId, preflightCheckout);

  const session = await mongoose.startSession();
  let createdOrder;

  try {
    await session.withTransaction(async () => {
      if (paymentMethod !== 'cod') {
        const existingOrder = await Order.findOne({ 'payment_info.id': verifiedPayment.paymentInfo.id }).session(session);
        if (existingOrder) {
          createdOrder = [existingOrder];
          return;
        }
      }

      const checkout = await buildCheckoutContext(
        req.userId!,
        verifiedPayment.couponCode || couponCode,
        session
      );

      if (paymentMethod !== 'cod' && Math.round(checkout.total * 100) !== Math.round(preflightCheckout.total * 100)) {
        throw new ApiError(409, 'Cart total changed during checkout. Please try again.');
      }

      for (const item of checkout.items) {
        const stockUpdate = await Product.updateOne(
          {
            _id: item.product._id,
            sizes: {
              $elemMatch: {
                size: item.size,
                stock: { $gte: item.quantity },
              },
            },
          },
          {
            $inc: {
              'sizes.$.stock': -item.quantity,
            },
          },
          { session }
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw new ApiError(409, `Stock changed for ${item.product.name}. Please review your cart and try again.`);
        }
      }

      let couponId = checkout.couponId;
      if (checkout.couponCode) {
        const couponFilter: Record<string, any> = {
          _id: checkout.couponId,
          is_active: true,
          valid_until: { $gte: new Date() },
        };

        if (checkout.couponCode) {
          couponFilter.code = checkout.couponCode;
        }

        const couponUpdate: Record<string, any> = {
          $inc: { usage_count: 1 },
        };

        if (checkout.couponId) {
          const coupon = await Coupon.findOneAndUpdate(
            {
              ...couponFilter,
              $or: [
                { usage_limit: { $exists: false } },
                { usage_limit: null },
                { $expr: { $gt: ['$usage_limit', '$usage_count'] } },
              ],
            },
            couponUpdate,
            { new: true, session }
          );

          if (!coupon) {
            throw new ApiError(409, 'Coupon is no longer available');
          }

          couponId = coupon._id as mongoose.Types.ObjectId;
        }
      }

      createdOrder = await Order.create([{
        user_id: req.userId,
        items: checkout.orderItems,
        shipping_address: mapShippingAddress(shippingAddress),
        payment_info: verifiedPayment.paymentInfo,
        pricing: {
          subtotal: checkout.subtotal,
          discount: checkout.discount,
          shipping_fee: checkout.shippingFee,
          tax: checkout.tax,
          total: checkout.total,
        },
        coupon_applied: couponId,
        status: paymentMethod === 'cod' ? 'PENDING' : 'PROCESSING',
      }], { session });

      await CartItem.deleteMany({ user_id: req.userId }, { session });
    });
  } finally {
    await session.endSession();
  }

  res.status(201).json(new ApiResponse(201, createdOrder?.[0], 'Order placed successfully'));
});

export const getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ user_id: req.userId }).sort({ created_at: -1 });
  res.status(200).json(new ApiResponse(200, orders, 'Orders retrieved successfully'));
});

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id, user_id: req.userId });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  res.status(200).json(new ApiResponse(200, order, 'Order retrieved successfully'));
});
