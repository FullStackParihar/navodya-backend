import mongoose from 'mongoose';
import { connectDB } from './src/config/database.js';
import { Order } from './src/models/order.model.js';
import { CartItem } from './src/models/cartItem.model.js';

const userId = '6999e687eecf60d2ffbc2d2c';

const run = async () => {
    try {
        await connectDB();
        console.log(`Checking database for user ${userId}...`);

        const cartItems = await CartItem.find({ user_id: userId });
        console.log(`Cart items: ${cartItems.length}`);
        cartItems.forEach(i => console.log(`  - Product: ${i.product_id}, Qty: ${i.quantity}`));

        const orders = await Order.find({ user_id: userId }).sort({ created_at: -1 }).limit(3);
        console.log(`Recent orders: ${orders.length}`);
        orders.forEach(o => console.log(`  - Order: ${o._id}, Status: ${o.status}, Created At: ${o.created_at}`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
