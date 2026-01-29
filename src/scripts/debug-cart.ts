
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { CartItem } from '../models/cartItem.model.js';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';

const debugCart = async () => {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log('Connected to MongoDB');

        // Ensure models are registered
        if (!mongoose.models.Product) {
            console.log('Registering Product model manually...');
            new Product();
        }

        const users = await User.find({});
        console.log(`Found ${users.length} users`);

        for (const user of users) {
            console.log(`\nChecking cart for User: ${user.name} (${user.email}) [${user._id}]`);

            const rawItems = await CartItem.find({ user_id: user._id });
            console.log(`  Raw Items in cart: ${rawItems.length}`);

            if (rawItems.length > 0) {
                try {
                    // We need to use 'Product' model for population.
                    const items = await CartItem.find({ user_id: user._id }).populate('product_id');
                    items.forEach((item, idx) => {
                        const prod = item.product_id as any;
                        // If population failed or product deleted, prod might be null
                        if (prod && prod.name) {
                            console.log(`    ${idx + 1}. Product: ${prod.name} (Qty: ${item.quantity})`);
                        } else {
                            console.log(`    ${idx + 1}. Product: [NULL/MISSING] (Qty: ${item.quantity}) - Ref: ${item.product_id}`);
                        }
                    });
                } catch (e: any) {
                    console.log('    Error populating items:', e.message);
                }
            }
        }

        const orphanItems = await CartItem.find({});
        console.log(`\nTotal CartItems in DB (All users): ${orphanItems.length}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

debugCart();
