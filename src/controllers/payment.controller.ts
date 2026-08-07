import { Request, Response } from 'express';
import crypto from 'crypto';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
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
import { pushOrderToShipway } from '../utils/shipway.js';

// Initialize Cashfree SDK
const pgEnv = config.cashfree.env.toUpperCase() === 'PRODUCTION'
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

const cashfree = new Cashfree(
    pgEnv,
    (config.cashfree.appId || '').trim(),
    (config.cashfree.secretKey || '').trim()
);

// Workaround for Cashfree PG SDK auto-generation bugs:
// 1. Force the correct stable API version
cashfree.XApiVersion = '2023-08-01';
// 2. Explicitly set basePath to avoid the undefined/orders endpoint bug
cashfree.basePath = pgEnv === CFEnvironment.PRODUCTION
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

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

// Helper function to complete order post-payment
export const completeOrder = async (order: any, cashfreeOrderDetails: any, paymentMethodName: string) => {
    // Atomically transition the order to PAID status if it is not already PAID
    const updatedOrder = await Order.findOneAndUpdate(
        { _id: order._id, 'payment_info.status': { $ne: 'PAID' } },
        {
            $set: {
                'payment_info.status': 'PAID',
                'payment_info.method': paymentMethodName || 'cashfree',
                'payment_info.transaction_details': cashfreeOrderDetails,
                status: 'PROCESSING'
            },
            $push: {
                status_history: {
                    status: 'PROCESSING',
                    changed_at: new Date(),
                    note: 'Payment verified and order placed successfully via Cashfree.',
                    changed_by: 'System'
                }
            }
        },
        { new: true }
    );

    // If updatedOrder is null, it means the order is already marked as PAID (e.g. handled by a concurrent request)
    if (!updatedOrder) {
        const existingPaidOrder = await Order.findById(order._id);
        return existingPaidOrder || order;
    }

    // 1. Decrement Stock
    for (const item of updatedOrder.items) {
        const product = await Product.findById(item.product_id);
        if (!product) continue;

        // Decrement size stock
        if (item.size) {
            const sizeIndex = product.sizes.findIndex((s: any) => s.size === item.size);
            if (sizeIndex > -1) {
                product.sizes[sizeIndex].stock = Math.max(0, product.sizes[sizeIndex].stock - item.quantity);
            }
        }

        // Decrement fabric variant stock
        if (item.fabric_variant_id) {
            const fabricIndex = product.fabric_variants?.findIndex((v: any) => String(v._id) === String(item.fabric_variant_id));
            if (fabricIndex !== undefined && fabricIndex > -1 && product.fabric_variants) {
                const variant = product.fabric_variants[fabricIndex];
                if (variant.stock !== undefined) {
                    variant.stock = Math.max(0, variant.stock - item.quantity);
                }
            }
        }

        await product.save();
    }

    // 2. Update Coupon Usage if coupon was applied
    if (updatedOrder.coupon_applied) {
        const coupon = await Coupon.findById(updatedOrder.coupon_applied);
        if (coupon) {
            coupon.usage_count += 1;
            await coupon.save();
        }
    }

    // 3. Clear user's cart
    await CartItem.deleteMany({ user_id: updatedOrder.user_id });

    // Push to Shipway asynchronously so we don't block response/verification
    pushOrderToShipway(updatedOrder._id.toString()).catch(err => {
        console.error(`[Shipway] Deferred push error for order ${updatedOrder._id}:`, err);
    });

    return updatedOrder;
};

// POST /api/payments/create-order
export const createCashfreeOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { couponCode, shippingAddress, orderId } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    let order;
    let cfOrderId;
    let total;

    // Clean customer phone number (Cashfree requires exactly 10 digits without country code)
    let customerPhone = user.phone || shippingAddress?.phone || shippingAddress?.contact || '9999999999';
    customerPhone = customerPhone.replace(/\D/g, ''); // Strip all non-digits
    if (customerPhone.length === 12 && customerPhone.startsWith('91')) {
        customerPhone = customerPhone.substring(2);
    }
    if (customerPhone.length > 10) {
        customerPhone = customerPhone.slice(-10);
    }
    if (customerPhone.length < 10) {
        customerPhone = '9999999999';
    }

    // Case 1: Retry flow for an existing unpaid order
    if (orderId) {
        order = await Order.findOne({ _id: orderId, user_id: req.userId });
        if (!order) {
            throw new ApiError(404, 'Order not found');
        }
        if (order.payment_info.status === 'PAID') {
            throw new ApiError(400, 'Order is already paid');
        }
        total = order.pricing.total;
        cfOrderId = `${order._id.toString()}_rt_${Date.now()}`;
    } 
    // Case 2: New order flow
    else {
        // Calculate prices from cart items
        const cartItems = await CartItem.find({ user_id: req.userId }).populate('product_id');
        if (!cartItems.length) {
            throw new ApiError(400, 'Cart is empty');
        }

        let subtotal = 0;
        const orderItems = [];

        for (const item of cartItems) {
            const product = item.product_id as unknown as IProduct;
            if (!product) continue;

            const fabric = resolveItemFabric(item, product);
            const price = fabric ? (fabric.sale_price ?? fabric.price) : (product.sale_price ?? product.price);
            subtotal += price * item.quantity;

            // Verify stock beforehand
            if (item.size) {
                const sizeObj = product.sizes.find(s => s.size === item.size);
                if (sizeObj && sizeObj.stock < item.quantity) {
                    throw new ApiError(400, `Insufficient stock for ${product.name} (Size: ${item.size})`);
                }
            }

            orderItems.push({
                product_id: product._id,
                name: product.name,
                image: product.images[0],
                price: price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                fabric_variant_id: fabric?._id,
                fabric_name: fabric?.name,
                fabric_price: fabric ? (fabric.sale_price ?? fabric.price) : undefined
            });
        }

        let discount = 0;
        let couponId = null;

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

        const shippingFee = subtotal > 700 ? 0 : 79;
        const tax = 0;
        total = Math.max(0, subtotal - discount + shippingFee + tax);
        cfOrderId = ''; // Will generate based on mongo _id

        // Map Shipping Address
        const mappedAddress = {
            firstname: shippingAddress?.fullName ? shippingAddress.fullName.split(' ')[0] : 'Customer',
            lastname: shippingAddress?.fullName ? shippingAddress.fullName.split(' ').slice(1).join(' ') : '',
            phone: shippingAddress?.phone || '',
            street: shippingAddress?.addressLine || shippingAddress?.address || 'N/A',
            city: shippingAddress?.city || 'N/A',
            state: shippingAddress?.state || 'N/A',
            zip_code: shippingAddress?.pincode || shippingAddress?.zip_code || 'N/A',
            country: shippingAddress?.country || 'India'
        };

        // Create the PENDING order in our DB
        order = await Order.create({
            user_id: req.userId,
            items: orderItems,
            shipping_address: mappedAddress,
            payment_info: {
                id: 'temporary_id',
                status: 'PENDING',
                method: 'cashfree'
            },
            pricing: {
                subtotal,
                discount,
                shipping_fee: shippingFee,
                tax,
                total
            },
            coupon_applied: couponId,
            status: 'PENDING'
        });

        cfOrderId = order._id.toString();
    }

    try {
        const isMock = !config.cashfree.appId || 
                       config.cashfree.appId.trim() === '' || 
                       config.cashfree.appId.startsWith('placeholder_') ||
                       config.cashfree.appId === 'YOUR_CASHFREE_APP_ID';

        if (isMock) {
            console.warn('Cashfree API credentials missing or invalid. Using Mock Cashfree Payment Session.');
            const mockSessionId = 'mock_cf_session_' + Date.now();
            const mockCfOrderId = 'mock_cf_order_' + Date.now();

            order.payment_info.id = cfOrderId;
            order.payment_info.payment_session_id = mockSessionId;
            order.payment_info.cf_order_id = mockCfOrderId;
            await order.save();

            return res.status(200).json(new ApiResponse(200, {
                paymentSessionId: mockSessionId,
                cfOrderId: mockCfOrderId,
                orderId: order._id,
                pricing: order.pricing,
                isMockMode: true
            }, 'Cashfree order created (Mock Mode)'));
        }

        let returnUrl = req.body.returnUrl || `${process.env.CLIENT_URL || 'http://localhost:3000'}/checkout`;
        if (returnUrl.includes('/checkout-dashboard')) {
            returnUrl = returnUrl.replace('/checkout-dashboard', '/checkout');
        }
        if (!returnUrl.includes('{order_id}')) {
            const separator = returnUrl.includes('?') ? '&' : '?';
            returnUrl = `${returnUrl}${separator}order_id={order_id}`;
        }
        let notifyUrl: string | undefined = undefined;

        if (config.cashfree.secretKey) {
            const backendUrl = process.env.BACKEND_URL;
            if (backendUrl && !backendUrl.includes('localhost') && !backendUrl.includes('127.0.0.1')) {
                notifyUrl = `${backendUrl}/api/payments/cashfree/webhook`;
            }
        }

        // Cashfree Production environment requires HTTPS return and notify URLs
        if (config.cashfree.env.toUpperCase() === 'PRODUCTION') {
            if (returnUrl.startsWith('http://')) {
                returnUrl = returnUrl.replace('http://', 'https://');
            }
            if (notifyUrl && notifyUrl.startsWith('http://')) {
                notifyUrl = notifyUrl.replace('http://', 'https://');
            }
        }
        const formattedAmount = Number(Number(total).toFixed(2));

        // Call Cashfree Order Creation API using Cashfree Node SDK
        const pgResponse = await cashfree.PGCreateOrder({
            order_id: cfOrderId,
            order_amount: formattedAmount,
            order_currency: 'INR',
            customer_details: {
                customer_id: order.user_id.toString(),
                customer_phone: customerPhone,
                customer_email: (user.email && user.email.trim() !== '') ? user.email.trim() : 'customer@example.com',
                customer_name: user.name || 'Customer'
            },
            order_meta: {
                return_url: returnUrl,
                notify_url: notifyUrl
            }
        });

        const cfOrder = pgResponse.data;

        // Update the order in our database with Cashfree IDs
        order.payment_info.id = cfOrderId;
        order.payment_info.payment_session_id = cfOrder.payment_session_id;
        order.payment_info.cf_order_id = cfOrder.cf_order_id;
        await order.save();

        res.status(200).json(new ApiResponse(200, {
            paymentSessionId: cfOrder.payment_session_id,
            cfOrderId: cfOrder.cf_order_id,
            orderId: order._id,
            pricing: order.pricing
        }, 'Cashfree order created successfully'));
    } catch (err: any) {
        console.error('Error creating Cashfree order details:', JSON.stringify(err.response?.data || err, null, 2));
        console.error('Diagnostic Cashfree Configuration:', {
            appIdMasked: config.cashfree.appId ? `${config.cashfree.appId.trim().substring(0, 8)}...` : 'undefined',
            appIdLengthOriginal: config.cashfree.appId?.length,
            appIdLengthTrimmed: config.cashfree.appId?.trim().length,
            secretKeyLengthOriginal: config.cashfree.secretKey?.length,
            secretKeyLengthTrimmed: config.cashfree.secretKey?.trim().length,
            env: config.cashfree.env,
            sdkBasePath: cashfree.basePath
        });
        if (err.response) {
            console.error('Cashfree HTTP Status:', err.response.status);
            console.error('Cashfree HTTP Headers:', err.response.headers);
        }
        
        const isAuthError = err.message?.includes('authentication Failed') || 
                            err.response?.data?.message?.includes('authentication Failed') ||
                            err.message?.includes('401') ||
                            err.response?.status === 401;
                            
        const shouldFallbackToMock = isAuthError || 
                                     (config.nodeEnv === 'development' && 
                                      (err.response?.status === 500 || err.response?.data?.message?.includes('api Request Failed')));

        if (shouldFallbackToMock) {
            console.warn(`Cashfree order creation failed. Falling back to Mock Mode in development.`);
            const mockSessionId = 'mock_cf_session_' + Date.now();
            const mockCfOrderId = 'mock_cf_order_' + Date.now();

            order.payment_info.id = cfOrderId;
            order.payment_info.payment_session_id = mockSessionId;
            order.payment_info.cf_order_id = mockCfOrderId;
            await order.save();

            return res.status(200).json(new ApiResponse(200, {
                paymentSessionId: mockSessionId,
                cfOrderId: mockCfOrderId,
                orderId: order._id,
                pricing: order.pricing,
                isMockMode: true
            }, 'Cashfree order created (Mock Mode)'));
        }
        
        throw new ApiError(500, err.response?.data?.message || 'Failed to create order with Cashfree');
    }
});

// POST /api/payments/verify
export const verifyPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { orderId } = req.body;
    if (!orderId) {
        throw new ApiError(400, 'Order ID is required');
    }

    const mongoOrderId = orderId.split('_rt_')[0];
    const order = await Order.findById(mongoOrderId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    if (order.payment_info.status === 'PAID') {
        return res.status(200).json(new ApiResponse(200, order, 'Payment already verified'));
    }

    const cfOrderId = order.payment_info.id;
    const isMockOrder = order.payment_info.payment_session_id?.startsWith('mock_cf_session_');

    if (isMockOrder) {
        console.warn('Verifying payment in Mock Mode.');
        const mockOrderDetails = {
            order_id: cfOrderId,
            order_status: 'PAID',
            payment_session_id: order.payment_info.payment_session_id,
            cf_order_id: order.payment_info.cf_order_id,
            payment_method: 'mock_cashfree'
        };
        const updatedOrder = await completeOrder(order, mockOrderDetails, 'mock_cashfree');
        return res.status(200).json(new ApiResponse(200, updatedOrder, 'Payment verified successfully (Mock Mode)'));
    }

    try {
        const pgResponse = await cashfree.PGFetchOrder(cfOrderId);
        const cfOrder = pgResponse.data;

        if (cfOrder.order_status === 'PAID') {
            const updatedOrder = await completeOrder(order, cfOrder, 'cashfree');
            return res.status(200).json(new ApiResponse(200, updatedOrder, 'Payment verified successfully'));
        } else {
            if (cfOrder.order_status === 'EXPIRED' || cfOrder.order_status === 'TERMINATED') {
                order.payment_info.status = 'FAILED';
                await order.save();
            }
            return res.status(200).json(new ApiResponse(200, {
                status: order.payment_info.status,
                cfStatus: cfOrder.order_status
            }, 'Payment not completed yet'));
        }
    } catch (err: any) {
        console.error('Error verifying Cashfree payment:', err.response?.data || err.message);
        throw new ApiError(500, err.response?.data?.message || err.message || 'Failed to verify payment with Cashfree');
    }
});

// POST /api/payments/cashfree/webhook
export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers['x-webhook-signature'] as string;
    const timestamp = req.headers['x-webhook-timestamp'] as string;
    const rawBody = (req as any).rawBody;

    if (!signature || !timestamp || !rawBody) {
        console.error('Webhook missing signature, timestamp, or rawBody');
        return res.status(400).json({ success: false, message: 'Missing headers' });
    }

    try {
        cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const event = req.body;
    console.log(`Received Cashfree Webhook Event: ${event?.type}`, event?.data);

    if (!event || !event.type) {
        return res.status(200).json({ success: true, message: 'Empty event payload ignored' });
    }

    if (event.type === 'PAYMENT_SUCCESS') {
        const cfOrderId = event.data?.order?.order_id;
        if (!cfOrderId) {
            console.warn('Webhook PAYMENT_SUCCESS missing order_id. Ignoring.');
            return res.status(200).json({ success: true, message: 'Missing order_id' });
        }
        
        const mongoOrderId = cfOrderId.split('_rt_')[0];
        if (!mongoOrderId.match(/^[0-9a-fA-F]{24}$/)) {
            console.warn(`Webhook order_id ${cfOrderId} is not a valid MongoDB ObjectId. Ignoring.`);
            return res.status(200).json({ success: true, message: 'Invalid order_id format' });
        }

        const order = await Order.findById(mongoOrderId);
        if (order) {
            const paymentMethodName = event.data?.payment?.payment_method 
                ? Object.keys(event.data.payment.payment_method)[0] 
                : 'cashfree';
            await completeOrder(order, event.data, paymentMethodName);
            console.log(`Order ${mongoOrderId} completed successfully via webhook.`);
        } else {
            console.error(`Order ${mongoOrderId} not found for success webhook.`);
        }
    } else if (event.type === 'PAYMENT_FAILED') {
        const cfOrderId = event.data?.order?.order_id;
        if (!cfOrderId) {
            console.warn('Webhook PAYMENT_FAILED missing order_id. Ignoring.');
            return res.status(200).json({ success: true, message: 'Missing order_id' });
        }

        const mongoOrderId = cfOrderId.split('_rt_')[0];
        if (!mongoOrderId.match(/^[0-9a-fA-F]{24}$/)) {
            console.warn(`Webhook order_id ${cfOrderId} is not a valid MongoDB ObjectId. Ignoring.`);
            return res.status(200).json({ success: true, message: 'Invalid order_id format' });
        }

        const order = await Order.findById(mongoOrderId);
        if (order && order.payment_info.status !== 'PAID') {
            order.payment_info.status = 'FAILED';
            order.payment_info.transaction_details = event.data;
            await order.save();
            console.log(`Order ${mongoOrderId} payment failed via webhook.`);
        }
    } else {
        console.log(`Webhook event type ${event.type} not processed.`);
    }

    res.status(200).json({ success: true });
});
