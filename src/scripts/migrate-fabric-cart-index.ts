import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import { CartItem } from '../models/cartItem.model.js';

const legacyIndex = 'user_id_1_product_id_1_size_1_color_1';

await connectDB();

const indexes = await CartItem.collection.indexes();
if (indexes.some(index => index.name === legacyIndex)) {
  await CartItem.collection.dropIndex(legacyIndex);
}

await CartItem.syncIndexes();
console.log('Fabric-aware cart index is ready.');
await mongoose.disconnect();
