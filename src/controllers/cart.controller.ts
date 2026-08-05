import { Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { CartItem } from '../models/cartItem.model.js';
import { Product, IProduct } from '../models/product.model.js';

const getCartItemPrice = (item: any, product: IProduct) => {
  if (item.fabric_variant_id) {
    const variant = product.fabric_variants?.find(v => String(v._id) === String(item.fabric_variant_id));
    if (variant) return variant.sale_price ?? variant.price;
  }
  return product.sale_price || product.price;
};

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

    const price = getCartItemPrice(item, product);
    return total + price * item.quantity;
  }, 0);

  const itemsWithProduct = validItems.map(item => {
    const product = item.product_id as unknown as IProduct;
    const itemObj = item.toObject();
    return {
      ...itemObj,
      fabric_price: getCartItemPrice(item, product),
      fabric_regular_price: item.fabric_variant_id
        ? product.fabric_variants?.find(v => String(v._id) === String(item.fabric_variant_id))?.price
        : undefined,
      fabric_sale_price: item.fabric_variant_id
        ? product.fabric_variants?.find(v => String(v._id) === String(item.fabric_variant_id))?.sale_price
        : undefined,
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
  const { productId, quantity, size, color, fabricVariantId } = req.body;
  console.log(`addToCart: User ${req.userId} adding ${productId}, size=${size}, color=${color}`);

  const product = await Product.findOne({ _id: productId, is_active: true });

  if (!product) {
    console.log('addToCart: Product not found');
    throw new ApiError(404, 'Product not found or not available');
  }

  const requestedSize = String(size || '').trim();
  const requestedColor = String(color || '').trim();

  const activeFabricVariants = product.fabric_variants?.filter(v => v.is_active) || [];
  let fabricVariant: any;
  if (activeFabricVariants.length > 0) {
    if (!fabricVariantId) throw new ApiError(400, 'Please select a fabric quality');
    fabricVariant = activeFabricVariants.find(v => String(v._id) === String(fabricVariantId));
    if (!fabricVariant) throw new ApiError(400, 'Selected fabric quality is not available');
    if (fabricVariant.stock !== undefined && fabricVariant.stock < quantity) {
      throw new ApiError(400, 'Selected fabric quality has insufficient stock');
    }
  } else if (fabricVariantId) {
    throw new ApiError(400, 'This product does not have fabric variants');
  }

  let sizeData = product.sizes.find((s) => s.size.toLowerCase() === requestedSize.toLowerCase());
  if (!sizeData) {
    if (!product.sizes || product.sizes.length === 0) {
      sizeData = { size: 'Free Size', stock: 9999 };
    } else if (product.sizes.length === 1 && !requestedSize) {
      sizeData = product.sizes[0];
    }
  }

  if (!sizeData || sizeData.stock < quantity) {
    console.log(`addToCart: Invalid size/stock. Available: ${JSON.stringify(product.sizes)}`);
    throw new ApiError(400, 'Selected size not available or insufficient stock');
  }

  const colorData = product.colors.find((c) => c.name.toLowerCase() === requestedColor.toLowerCase());
  const normalizedColor = colorData?.name || requestedColor || 'N/A';
  const colorExists = product.colors.length === 0 || !!colorData;
  if (!colorExists) {
    console.log(`addToCart: Invalid color ${color}. Available: ${JSON.stringify(product.colors)}`);
    throw new ApiError(400, 'Selected color not available');
  }

  let cartItem = await CartItem.findOne({
    user_id: req.userId,
    product_id: productId,
    size: sizeData.size,
    color: normalizedColor,
    fabric_variant_id: fabricVariant?._id,
  });

  if (cartItem) {
    const newQuantity = cartItem.quantity + quantity;

    if (newQuantity > sizeData.stock) {
      throw new ApiError(400, 'Cannot add more items than available stock');
    }
    if (fabricVariant?.stock !== undefined && newQuantity > fabricVariant.stock) {
      throw new ApiError(400, 'Cannot add more items than the selected fabric stock');
    }

    cartItem.quantity = newQuantity;
    await cartItem.save();
  } else {
    cartItem = await CartItem.create({
      user_id: req.userId,
      product_id: productId,
      quantity,
      size: sizeData.size,
      color: normalizedColor,
      fabric_variant_id: fabricVariant?._id,
      fabric_name: fabricVariant?.name,
      fabric_price: fabricVariant ? (fabricVariant.sale_price ?? fabricVariant.price) : undefined,
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

  let sizeData = product.sizes.find((s) => s.size === cartItem.size);
  if (!sizeData && (!product.sizes || product.sizes.length === 0)) {
    sizeData = { size: 'Free Size', stock: 9999 };
  }

  if (!sizeData || quantity > sizeData.stock) {
    throw new ApiError(400, 'Requested quantity exceeds available stock');
  }

  if (cartItem.fabric_variant_id) {
    const variant = product.fabric_variants?.find(v => String(v._id) === String(cartItem.fabric_variant_id));
    if (!variant?.is_active) throw new ApiError(400, 'Selected fabric quality is no longer available');
    if (variant.stock !== undefined && quantity > variant.stock) {
      throw new ApiError(400, 'Requested quantity exceeds selected fabric stock');
    }
    cartItem.fabric_name = variant.name;
    cartItem.fabric_price = variant.sale_price ?? variant.price;
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
