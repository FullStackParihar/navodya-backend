import { Request, Response } from 'express';
import Stripe from 'stripe';
import mongoose from 'mongoose';
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

    for (const item of cartItems) {
        const product = item.product_id as unknown as IProduct;
        if (!product || !product.is_active) {
            throw new ApiError(400, 'One or more products in your cart are no longer available.');
        }

        const sizeData = product.sizes.find(s => s.size === item.size);
        if (!sizeData || sizeData.stock < item.quantity) {
            throw new ApiError(400, `Insufficient stock for ${product.name} (Size: ${item.size})`);
        }

        const price = product.sale_price || product.price;
        subtotal += price * item.quantity;
    }

    // 3. Apply Coupon
    let discount = 0;
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
            } else {
                throw new ApiError(400, `Coupon requires a minimum order amount of ₹${coupon.min_order_amount}`);
            }
        } else {
            throw new ApiError(400, 'Invalid or expired coupon code');
        }
    }

    const shippingFee = 0; 
    const tax = 0; 
    const total = subtotal - discount + shippingFee + tax;

    // 4. Create Stripe Intent
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // Stripe expects cents
            currency: 'inr', 
            metadata: {
                userId: req.userId as string,
                couponCode: couponCode ? couponCode.toUpperCase() : ''
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

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
    } catch (error: any) {
        console.error('Stripe Payment Intent Error:', error);
        throw new ApiError(500, 'Failed to initialize payment gateway');
    }
});

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { paymentIntentId, shippingAddress } = req.body;

    if (!paymentIntentId) {
        throw new ApiError(400, 'Payment Intent ID is required');
    }

    // 1. Idempotency & Replay Protection
    const existingOrder = await Order.findOne({ 'payment_info.id': paymentIntentId });
    if (existingOrder) {
        throw new ApiError(400, 'An order has already been created for this payment');
    }

    // 2. Fetch Payment Intent from Stripe
    let paymentIntent;
    try {
        paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
        console.error('Stripe Retrieve Error:', error);
        throw new ApiError(400, 'Invalid payment intent');
    }

    if (paymentIntent.status !== 'succeeded') {
        throw new ApiError(400, 'Payment has not been completed successfully');
    }
    if (paymentIntent.currency !== 'inr') {
        throw new ApiError(400, 'Invalid payment currency');
    }

    // 3. Start Database Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const mappedAddress = {
            street: shippingAddress.addressLine || shippingAddress.address || 'N/A',
            city: shippingAddress.city || 'N/A',
            state: shippingAddress.state || 'N/A',
            zip_code: shippingAddress.pincode || shippingAddress.zip_code || 'N/A',
            country: shippingAddress.country || 'India'
        };

        const cartItems = await CartItem.find({ user_id: req.userId }).populate('product_id').session(session);
        if (!cartItems.length) {
            throw new ApiError(400, 'Cart is empty');
        }

        const orderItems: any[] = [];
        let subtotal = 0;

        // 4. Calculate totals and deduct stock atomically
        for (const item of cartItems) {
            const product = item.product_id as unknown as IProduct;
            if (!product || !product.is_active) {
                throw new ApiError(400, 'A product in your cart is no longer available');
            }

            const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
            if (sizeIndex === -1 || product.sizes[sizeIndex].stock < item.quantity) {
                throw new ApiError(400, `Insufficient stock for ${product.name} (Size: ${item.size})`);
            }

            // Atomic decrement to prevent race conditions
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: product._id, 'sizes.size': item.size, 'sizes.stock': { $gte: item.quantity } },
                { $inc: { 'sizes.$.stock': -item.quantity } },
                { new: true, session }
            );

            if (!updatedProduct) {
                throw new ApiError(400, `Failed to reserve stock for ${product.name}`);
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

        // 5. Apply Coupon
        let discount = 0;
        let couponId: any = undefined;
        const couponCode = (paymentIntent.metadata.couponCode || '').toUpperCase();

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode }).session(session);
            if (coupon && coupon.isValid() && (!coupon.min_order_amount || subtotal >= coupon.min_order_amount)) {
                if (coupon.type === 'PERCENTAGE') {
                    discount = (subtotal * coupon.value) / 100;
                    if (coupon.max_discount_amount && discount > coupon.max_discount_amount) discount = coupon.max_discount_amount;
                } else {
                    discount = coupon.value;
                }
                if (discount > subtotal) discount = subtotal;
                couponId = coupon._id;

                // Update usage count
                await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usage_count: 1 } }, { session });
            }
        }

        const total = subtotal - discount;

        // 6. Security Verification: Compare Stripe amount with calculated total
        const expectedStripeAmount = Math.round(total * 100);
        if (paymentIntent.amount !== expectedStripeAmount) {
            console.error(`Fraud attempt detected: Stripe amount ${paymentIntent.amount} != Expected ${expectedStripeAmount}`);
            throw new ApiError(400, 'Payment amount mismatch. Order verification failed.');
        }

        // 7. Create Order
        const order = await Order.create([{
            user_id: req.userId,
            items: orderItems,
            shipping_address: mappedAddress,
            payment_info: {
                id: paymentIntentId,
                status: 'PAID',
                method: paymentIntent.payment_method_types[0] || 'card'
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
        }], { session });

        // 8. Clear Cart
        await CartItem.deleteMany({ user_id: req.userId }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(new ApiResponse(201, order[0], 'Order placed successfully'));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
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
