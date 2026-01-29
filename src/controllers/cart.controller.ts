import { Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { CartItem } from '../models/cartItem.model.js';
import { Product, IProduct } from '../models/product.model.js';

export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log('getCart called for User:', req.userId);
  const cartItems = await CartItem.find({ user_id: req.userId })
    .populate('product_id') // Populates with full product document
    .sort({ created_at: -1 });

  console.log('Found cart items:', cartItems.length);
  // cartItems.forEach(item => console.log('Item:', item.product_id));

  // Filter out items where the product has been deleted (null after populate)
  const validItems = cartItems.filter(item => item.product_id);

  const subtotal = validItems.reduce((total, item) => {
    const product = item.product_id as unknown as IProduct;
    // Check if product exists just in case, though filter above handles it
    if (!product) return total;

    const price = product.sale_price || product.price;
    return total + price * item.quantity;
  }, 0);

  const itemsWithProduct = validItems.map(item => {
    const product = item.product_id as unknown as IProduct;
    const itemObj = item.toObject();
    return {
      ...itemObj,
      products: product, // Map populated field to 'products' to match frontend expectation
      product_id: product?._id || item.product_id
    };
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        items: itemsWithProduct,
        summary: {
          itemCount: cartItems.length,
          totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: parseFloat(subtotal.toFixed(2)),
        },
      },
      'Cart retrieved successfully'
    )
  );
});

export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, quantity, size, color } = req.body;
  console.log(`addToCart: User ${req.userId} adding ${productId}, size=${size}, color=${color}`);

  const product = await Product.findOne({ _id: productId, is_active: true });

  if (!product) {
    console.log('addToCart: Product not found');
    throw new ApiError(404, 'Product not found or not available');
  }

  const sizeData = product.sizes.find((s) => s.size === size);
  if (!sizeData || sizeData.stock < quantity) {
    console.log(`addToCart: Invalid size/stock. Available: ${JSON.stringify(product.sizes)}`);
    throw new ApiError(400, 'Selected size not available or insufficient stock');
  }

  const colorExists = product.colors.some((c) => c.name === color);
  if (!colorExists) {
    console.log(`addToCart: Invalid color ${color}. Available: ${JSON.stringify(product.colors)}`);
    throw new ApiError(400, 'Selected color not available');
  }

  let cartItem = await CartItem.findOne({
    user_id: req.userId,
    product_id: productId,
    size,
    color,
  });

  if (cartItem) {
    const newQuantity = cartItem.quantity + quantity;

    if (newQuantity > sizeData.stock) {
      throw new ApiError(400, 'Cannot add more items than available stock');
    }

    cartItem.quantity = newQuantity;
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({
      user_id: req.userId,
      product_id: productId,
      quantity,
      size,
      color,
    });
  }

  // Populate for response
  const populatedCartItem = await CartItem.findById(cartItem._id).populate('product_id');
  const resultObj = populatedCartItem?.toObject();
  if (resultObj) {
    (resultObj as any).products = resultObj.product_id;
  }

  res.status(201).json(new ApiResponse(201, resultObj, 'Item added to cart successfully'));
});

export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const cartItem = await CartItem.findOne({ _id: id, user_id: req.userId }).populate('product_id');

  if (!cartItem) {
    throw new ApiError(404, 'Cart item not found');
  }

  const product = cartItem.product_id as unknown as IProduct;
  if (!product) {
    throw new ApiError(404, 'Product associated with cart item not found');
  }

  const sizeData = product.sizes.find((s) => s.size === cartItem.size);

  if (!sizeData || quantity > sizeData.stock) {
    throw new ApiError(400, 'Requested quantity exceeds available stock');
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  const resultObj = cartItem.toObject();
  (resultObj as any).products = product;

  res.status(200).json(new ApiResponse(200, resultObj, 'Cart item updated successfully'));
});

export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await CartItem.deleteOne({ _id: id, user_id: req.userId });

  if (result.deletedCount === 0) {
    // throw new ApiError(404, 'Item not found'); // Optional
  }

  res.status(200).json(new ApiResponse(200, null, 'Item removed from cart successfully'));
});

export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  await CartItem.deleteMany({ user_id: req.userId });

  res.status(200).json(new ApiResponse(200, null, 'Cart cleared successfully'));
});
