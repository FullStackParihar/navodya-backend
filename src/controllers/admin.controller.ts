import { Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { User } from '../models/user.model.js';
import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';

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
