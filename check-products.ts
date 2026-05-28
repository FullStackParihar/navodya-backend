import { connectDB } from './src/config/database.js';
import { Product } from './src/models/product.model.js';

async function main() {
  await connectDB();
  
  const products = await Product.find({}).lean();
  console.log('Products in DB:', JSON.stringify(products, null, 2));
  
  process.exit(0);
}

main();
