import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { Order } from '../models/order.model.js';
import { CartItem } from '../models/cartItem.model.js';
import { Coupon } from '../models/coupon.model.js';
import { Product, IProduct } from '../models/product.model.js';
import { config } from '../config/env.js';

const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: 'latest' as any,
});

export const createPaymentIntent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { couponCode, shippingAddress } = req.body;

    // 1. Get Cart Items
    const cartItems = await CartItem.find({ user_id: req.userId }).populate('product_id');

    if (!cartItems.length) {
        throw new ApiError(400, 'Cart is empty');
    }

    // 2. Calculate Subtotal
    let subtotal = 0;
    const items = [];

    for (const item of cartItems) {
        const product = item.product_id as unknown as IProduct;
        if (!product) continue;

        // Check stock here as well? Ideally yes.
        const price = product.sale_price || product.price;
        subtotal += price * item.quantity;

        items.push({
            product_id: product._id,
            name: product.name,
            image: product.images[0],
            price: price,
            quantity: item.quantity,
            size: item.size,
            color: item.color
        });
    }

    // 3. Apply Coupon
    let discount = 0;
    let couponId: any = undefined;

    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon && coupon.isValid()) {
            if (!coupon.min_order_amount || subtotal >= coupon.min_order_amount) {
                if (coupon.type === 'PERCENTAGE') {
                    discount = (subtotal * coupon.value) / 100;
                    if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
                        discount = coupon.max_discount_amount;
                    }
                } else {
                    discount = coupon.value;
                }
                if (discount > subtotal) discount = subtotal;
                couponId = coupon._id;
            }
        }
    }

    const shippingFee = 0; // Free shipping for now, or logic based on total
    const tax = 0; // Simplified
    const total = subtotal - discount + shippingFee + tax;

    // 4. Create Stripe Intent (with fallback for testing)
    let paymentIntent;
    try {
        paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // Stripe expects cents
            currency: 'inr', // or usd
            metadata: {
                userId: req.userId as string,
                couponCode: couponCode || ''
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });
    } catch (error: any) {
        // If Stripe key is invalid or not set, return a mock intent for testing
        if (error.type === 'StripeAuthenticationError' || error.message.includes('Invalid API Key') || config.stripe.secretKey.startsWith('sk_test_placeholder')) {
            console.warn('Stripe API Key invalid or placeholder. Using Mock Payment Intent.');
            return res.status(200).json(new ApiResponse(200, {
                clientSecret: 'mock_secret_for_testing',
                paymentIntentId: 'mock_pi_' + Date.now(),
                pricing: {
                    subtotal,
                    discount,
                    shippingFee,
                    tax,
                    total
                },
                isTestMode: true // Flag to tell frontend to bypass Stripe Elements
            }, 'Payment intent created (Mock Mode)'));
        }
        throw error;
    }

    res.status(200).json(new ApiResponse(200, {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        pricing: {
            subtotal,
            discount,
            shippingFee,
            tax,
            total
        }
    }, 'Payment intent created'));
});

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { paymentIntentId, shippingAddress } = req.body;

    if (!paymentIntentId) {
        throw new ApiError(400, 'Payment Intent ID is required');
    }

    // Verify Payment Intent Status (Mock/COD Bypass)
    let paymentIntentStub = { status: 'succeeded', metadata: { couponCode: '' } as any, payment_method_types: ['card'] };

    if (paymentIntentId.startsWith('mock_pi_') || paymentIntentId.startsWith('cod_')) {
        // Bypass Stripe verification
        paymentIntentStub.metadata.couponCode = req.body.couponCode || '';
        if (paymentIntentId.startsWith('cod_')) {
            paymentIntentStub.payment_method_types = ['cod'];
        }
    } else {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            throw new ApiError(400, 'Payment not successful');
        }
        paymentIntentStub = paymentIntent;
    }

    // Check if order already exists for this intent
    const existingOrder = await Order.findOne({ 'payment_info.id': paymentIntentId });
    if (existingOrder) {
        return res.status(200).json(new ApiResponse(200, existingOrder, 'Order already exists'));
    }

    // Get Cart logic again (Should ideally be atomic or locked)
    const cartItems = await CartItem.find({ user_id: req.userId }).populate('product_id');
    if (!cartItems.length) {
        throw new ApiError(400, 'Cart is empty');
    }

    const orderItems: any[] = [];
    let subtotal = 0;

    for (const item of cartItems) {
        const product = item.product_id as unknown as IProduct;

        // Decrement Stock
        const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
        if (sizeIndex > -1) {
            if (product.sizes[sizeIndex].stock < item.quantity) {
                throw new ApiError(400, `Insufficient stock for ${product.name} (Size: ${item.size})`);
            }
            product.sizes[sizeIndex].stock -= item.quantity;
            await product.save(); // Save stock update
        }

        const price = product.sale_price || product.price;
        subtotal += price * item.quantity;

        orderItems.push({
            product_id: product._id,
            name: product.name,
            image: product.images[0],
            price: price,
            quantity: item.quantity,
            size: item.size,
            color: item.color
        });
    }

    // Re-calculate details
    let discount = 0;
    let couponId: any = undefined;
    const couponCode = paymentIntentStub.metadata.couponCode;

    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode });
        // Logic to apply discount... (Simplified duplications)
        if (coupon) {
            if (coupon.type === 'PERCENTAGE') {
                discount = (subtotal * coupon.value) / 100;
                if (coupon.max_discount_amount && discount > coupon.max_discount_amount) discount = coupon.max_discount_amount;
            } else {
                discount = coupon.value;
            }
            couponId = coupon._id;

            // Update usage count
            coupon.usage_count += 1;
            await coupon.save();
        }
    }

    const total = subtotal - discount; // Tax/Shipping assumed same

    const order = await Order.create({
        user_id: req.userId,
        items: orderItems,
        shipping_address: shippingAddress,
        payment_info: {
            id: paymentIntentId,
            status: paymentIntentId.startsWith('cod_') ? 'UNPAID' : 'PAID',
            method: paymentIntentStub.payment_method_types[0]
        },
        pricing: {
            subtotal,
            discount,
            shipping_fee: 0,
            tax: 0,
            total
        },
        coupon_applied: couponId,
        status: 'PROCESSING'
    });

    // Clear Cart
    await CartItem.deleteMany({ user_id: req.userId });

    res.status(201).json(new ApiResponse(201, order, 'Order placed successfully'));
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
