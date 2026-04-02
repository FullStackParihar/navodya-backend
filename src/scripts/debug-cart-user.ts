import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { CartItem } from '../models/cartItem.model.js';
import { User } from '../models/user.model.js';

async function debugCart() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB');

    const userId = '6999e687eecf60d2ffbc2d2c';
    
    console.log(`\n=== Debugging Cart for User: ${userId} ===\n`);

    // Check if user exists
    const user = await User.findById(userId);
    console.log('User exists:', !!user);
    if (user) {
      console.log('User email:', user.email);
      console.log('User name:', user.name);
    }

    // Check all cart items for this user
    const cartItems = await CartItem.find({ user_id: userId });
    console.log('\nRaw cart items count:', cartItems.length);
    
    if (cartItems.length > 0) {
      console.log('\nCart items details:');
      cartItems.forEach((item, index) => {
        console.log(`Item ${index + 1}:`);
        console.log(`  ID: ${item._id}`);
        console.log(`  Product ID: ${item.product_id}`);
        console.log(`  Quantity: ${item.quantity}`);
        console.log(`  Size: ${item.size}`);
        console.log(`  Color: ${item.color}`);
        console.log(`  Created: ${item.created_at}`);
      });
    }

    // Check with populate
    const populatedCartItems = await CartItem.find({ user_id: userId }).populate('product_id');
    console.log('\nPopulated cart items count:', populatedCartItems.length);
    
    if (populatedCartItems.length > 0) {
      console.log('\nPopulated cart items details:');
      populatedCartItems.forEach((item, index) => {
        console.log(`Item ${index + 1}:`);
        console.log(`  Product exists: !!${item.product_id}`);
        if (item.product_id) {
          const product = item.product_id as any;
          console.log(`  Product name: ${product.name}`);
          console.log(`  Product price: ${product.price}`);
          console.log(`  Product active: ${product.is_active}`);
        }
      });
    }

    // Check all cart items in the system
    const allCartItems = await CartItem.find({});
    console.log('\nTotal cart items in system:', allCartItems.length);
    
    const uniqueUsers = [...new Set(allCartItems.map(item => item.user_id.toString()))];
    console.log('Unique users with cart items:', uniqueUsers.length);
    console.log('User IDs with cart items:', uniqueUsers);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugCart();
