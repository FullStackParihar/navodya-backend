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
import { User } from '../models/user.model.js';
import { config } from '../config/env.js';
import PDFDocument from 'pdfkit';

const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: 'latest' as any,
});

const resolveItemFabric = (item: any, product: IProduct) => {
    if (!item.fabric_variant_id) {
        if (product.fabric_variants?.some(v => v.is_active)) {
            throw new ApiError(400, `Select a fabric quality for ${product.name}`);
        }
        return null;
    }
    const variant = product.fabric_variants?.find(v => String(v._id) === String(item.fabric_variant_id));
    if (!variant?.is_active) throw new ApiError(400, `Selected fabric quality is no longer available for ${product.name}`);
    if (variant.stock !== undefined && variant.stock < item.quantity) {
        throw new ApiError(400, `Insufficient ${variant.name} stock for ${product.name}`);
    }
    return variant;
};

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
        const fabric = resolveItemFabric(item, product);
        const price = fabric ? (fabric.sale_price ?? fabric.price) : (product.sale_price ?? product.price);
        subtotal += price * item.quantity;

        items.push({
            product_id: product._id,
            name: product.name,
            image: product.images[0],
            price: price,
            quantity: item.quantity,
            size: item.size,
            color: item.color
            ,fabric_variant_id: fabric?._id
            ,fabric_name: fabric?.name
            ,fabric_price: fabric ? (fabric.sale_price ?? fabric.price) : undefined
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

    // Map Shipping Address to model schema
    const mappedAddress = {
        street: shippingAddress.addressLine || shippingAddress.address || 'N/A',
        city: shippingAddress.city || 'N/A',
        state: shippingAddress.state || 'N/A',
        zip_code: shippingAddress.pincode || shippingAddress.zip_code || 'N/A',
        country: shippingAddress.country || 'India'
    };

    // Get Cart logic again (Should ideally be atomic or locked)
    const cartItems = await CartItem.find({ user_id: req.userId }).populate('product_id');
    if (!cartItems.length) {
        throw new ApiError(400, 'Cart is empty');
    }

    const orderItems: any[] = [];
    let subtotal = 0;

    for (const item of cartItems) {
        const product = item.product_id as unknown as IProduct;
        if (!product) continue;

        const fabric = resolveItemFabric(item, product);

        // Decrement Stock
        const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
        if (sizeIndex > -1) {
            if (product.sizes[sizeIndex].stock < item.quantity) {
                throw new ApiError(400, `Insufficient stock for ${product.name} (Size: ${item.size})`);
            }
            product.sizes[sizeIndex].stock -= item.quantity;
        }

        if (fabric?.stock !== undefined) fabric.stock -= item.quantity;
        await product.save();

        const price = fabric ? (fabric.sale_price ?? fabric.price) : (product.sale_price ?? product.price);
        subtotal += price * item.quantity;

        orderItems.push({
            product_id: product._id,
            name: product.name,
            image: product.images[0],
            price: price,
            quantity: item.quantity,
            size: item.size,
            color: item.color
            ,fabric_variant_id: fabric?._id
            ,fabric_name: fabric?.name
            ,fabric_price: fabric ? (fabric.sale_price ?? fabric.price) : undefined
        });
    }

    // Re-calculate details
    let discount = 0;
    let couponId: any = undefined;
    const couponCode = (paymentIntentStub.metadata.couponCode || '').toUpperCase();

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
        shipping_address: mappedAddress,
        payment_info: {
            id: paymentIntentId,
            status: paymentIntentId.startsWith('cod_') ? 'PENDING' : 'PAID',
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

export const downloadInvoice = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    
    // Find order and verify access (must be owner or admin)
    // Note: The route should use authenticate middleware.
    // We fetch the order. If req.user is an admin (we check via a property or just assume admin route handles it differently).
    // Let's just fetch by ID, and if the user is not admin, ensure they own it.
    let order;
    
    // Check if admin (Assuming req.user is set by auth middleware, but we only have req.userId)
    const user = await User.findById(req.userId);
    const isAdmin = user && user.role === 'admin';

    if (isAdmin) {
        order = await Order.findById(id);
    } else {
        order = await Order.findOne({ _id: id, user_id: req.userId });
    }

    if (!order) {
        throw new ApiError(404, 'Order not found or unauthorized');
    }

    // Initialize PDF Document
    const doc = new PDFDocument({ margin: 50 });

    // Stream directly to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
    
    doc.pipe(res);

    // Build the PDF
    // Header
    doc.fontSize(25).font('Helvetica-Bold').text('NAVODAYA TRENDZ', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('Premium Alumni Merchandise', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Order Info
    doc.fontSize(12).font('Helvetica-Bold').text(`Order ID: `, { continued: true }).font('Helvetica').text(order._id.toString());
    doc.font('Helvetica-Bold').text(`Date: `, { continued: true }).font('Helvetica').text(new Date(order.created_at).toLocaleDateString());
    doc.font('Helvetica-Bold').text(`Status: `, { continued: true }).font('Helvetica').text(order.status);
    doc.moveDown();

    // Customer Info
    doc.font('Helvetica-Bold').text('Bill To:');
    doc.font('Helvetica').text(`Customer ID: ${order.user_id}`);
    doc.text(`Address: ${order.shipping_address.street}, ${order.shipping_address.city}, ${order.shipping_address.state}, ${order.shipping_address.zip_code}, ${order.shipping_address.country}`);
    doc.moveDown();

    // Table Header
    const tableTop = doc.y;
    doc.font('Helvetica-Bold');
    doc.text('Item', 50, tableTop);
    doc.text('Qty', 350, tableTop);
    doc.text('Price', 400, tableTop);
    doc.text('Total', 480, tableTop);
    
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    
    let yPosition = tableTop + 25;
    doc.font('Helvetica');

    // Table Rows
    order.items.forEach((item: any) => {
        const options = [item.size, item.fabric_name].filter(Boolean).join(', ') || 'N/A';
        doc.text(`${item.name} (${options})`, 50, yPosition, { width: 280 });
        doc.text(item.quantity.toString(), 350, yPosition);
        doc.text(`Rs. ${item.price}`, 400, yPosition);
        doc.text(`Rs. ${item.price * item.quantity}`, 480, yPosition);
        yPosition += 25;
    });

    doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
    yPosition += 15;

    // Totals
    doc.font('Helvetica-Bold');
    doc.text('Subtotal:', 380, yPosition);
    doc.font('Helvetica').text(`Rs. ${order.pricing.subtotal}`, 480, yPosition);
    yPosition += 20;

    if (order.pricing.discount > 0) {
        doc.font('Helvetica-Bold').text('Discount:', 380, yPosition);
        doc.font('Helvetica').text(`- Rs. ${order.pricing.discount}`, 480, yPosition);
        yPosition += 20;
    }

    if (order.pricing.shipping_fee > 0) {
        doc.font('Helvetica-Bold').text('Shipping:', 380, yPosition);
        doc.font('Helvetica').text(`Rs. ${order.pricing.shipping_fee}`, 480, yPosition);
        yPosition += 20;
    }

    doc.font('Helvetica-Bold').fontSize(14).text('Total Amount:', 350, yPosition + 10);
    doc.text(`Rs. ${order.pricing.total}`, 480, yPosition + 10);

    // Footer
    doc.moveDown(4);
    doc.fontSize(10).font('Helvetica-Oblique').text('Thank you for shopping with Navodaya Trendz!', { align: 'center' });

    // Finalize PDF
    doc.end();
});
