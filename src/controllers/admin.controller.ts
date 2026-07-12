import { Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { User } from '../models/user.model.js';
import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';

const VALID_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'] as const;
type OrderStatus = typeof VALID_STATUSES[number];

export const getAdminStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ is_active: true });

    const orders = await Order.find();
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'PROCESSING').length;
    const revenue = orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

    const totalProducts = await Product.countDocuments();

    res.status(200).json(
        new ApiResponse(200, {
            totalUsers,
            activeUsers,
            totalOrders,
            pendingOrders,
            revenue,
            totalProducts,
            conversionRate: totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) : 0
        }, 'Admin stats retrieved successfully')
    );
});

export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Populate user_id so admin can see customer name, email, phone
    const orders = await Order.find()
        .populate('user_id', 'name email phone')
        .sort({ created_at: -1 });
    res.status(200).json(new ApiResponse(200, orders, 'All orders retrieved successfully'));
});

// Get single order by ID with full user details — used by the admin detail modal
export const getAdminOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
        .populate('user_id', 'name email phone address city state pincode')
        .populate('coupon_applied', 'code type value');

    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    res.status(200).json(new ApiResponse(200, order, 'Order retrieved successfully'));
});

export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const users = await User.find().select('-password').sort({ created_at: -1 });
    res.status(200).json(new ApiResponse(200, users, 'All users retrieved successfully'));
});

export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { orderId } = req.params;
    const { status, note } = req.body;

    // Validate the incoming status value
    if (!VALID_STATUSES.includes(status as OrderStatus)) {
        throw new ApiError(400, `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`);
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    const previousStatus = order.status;

    // Append to status history audit trail
    order.status_history.push({
        status: status as OrderStatus,
        changed_at: new Date(),
        note: note || undefined,
        changed_by: (req.user as any)?.name || (req.user as any)?.email || 'admin'
    });

    order.status = status as OrderStatus;
    await order.save();

    // Re-populate user info before responding so frontend gets consistent data
    await order.populate('user_id', 'name email phone');

    res.status(200).json(new ApiResponse(200, order, `Order status updated from ${previousStatus} to ${status}`));
});

// Update or set tracking information for an order
export const updateOrderTracking = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { orderId } = req.params;
    const { carrier, tracking_number, url } = req.body;

    if (!carrier && !tracking_number && !url) {
        throw new ApiError(400, 'At least one tracking field (carrier, tracking_number, url) is required');
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    // Merge provided tracking fields (don't wipe existing fields if not provided)
    order.tracking = {
        carrier: carrier ?? order.tracking?.carrier,
        tracking_number: tracking_number ?? order.tracking?.tracking_number,
        url: url ?? order.tracking?.url
    };

    await order.save();
    await order.populate('user_id', 'name email phone');

    res.status(200).json(new ApiResponse(200, order, 'Tracking information updated successfully'));
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});
