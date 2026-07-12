import { Request, Response } from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { BulkOrder, BULK_ORDER_STATUSES, BulkOrderStatus } from '../models/bulkOrder.model.js';
import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

const APPAREL_SIZE_KEYS = ['xs', 's', 'm', 'l', 'xl', 'xxl', '3xl', '4xl'];
const MAX_FILES_PER_PRODUCT = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const clean = (value: unknown) => String(value ?? '').trim();

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidPhone = (value: string) => /^[+]?\d[\d\s-]{7,14}$/.test(value);
const isValidPincode = (value: string) => /^\d{6}$/.test(value);

const removeUploadedFiles = (files: Express.Multer.File[] = []) => {
  files.forEach((file) => {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  });
};

const generateRequestNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `BO-${year}-`;
  const count = await BulkOrder.countDocuments({ request_number: { $regex: `^${prefix}` } });
  return `${prefix}${String(count + 1).padStart(4, '0')}`;
};

const getFileUrl = (req: Request, file: Express.Multer.File) => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/bulk-orders/${file.filename}`;
};

const validateUploadedFiles = (files: Express.Multer.File[] = []) => {
  const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.ai', '.eps', '.svg']);
  const allowedMimePrefixes = ['image/'];
  const allowedMimeTypes = new Set([
    'application/pdf',
    'application/postscript',
    'application/illustrator',
    'application/octet-stream',
    'image/svg+xml',
  ]);

  const seenByField = new Map<string, Set<string>>();

  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeOk = allowedMimePrefixes.some(prefix => file.mimetype.startsWith(prefix)) || allowedMimeTypes.has(file.mimetype);
    if (!allowedExtensions.has(ext) || !mimeOk) {
      throw new ApiError(400, `Unsupported file type: ${file.originalname}`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError(400, `File too large: ${file.originalname}`);
    }
    const fieldFiles = seenByField.get(file.fieldname) || new Set<string>();
    const duplicateKey = `${file.originalname}-${file.size}`;
    if (fieldFiles.has(duplicateKey)) {
      throw new ApiError(400, `Duplicate file uploaded: ${file.originalname}`);
    }
    fieldFiles.add(duplicateKey);
    seenByField.set(file.fieldname, fieldFiles);
    if (fieldFiles.size > MAX_FILES_PER_PRODUCT) {
      throw new ApiError(400, `Maximum ${MAX_FILES_PER_PRODUCT} files allowed per product`);
    }
  }
};

const getCustomerBulkOrderFilter = (req: AuthRequest) => {
  const userEmail = clean(req.user?.email).toLowerCase();
  const accessFilters: any[] = [{ user_id: req.userId }];

  if (userEmail) {
    accessFilters.push({
      $and: [
        { $or: [{ user_id: { $exists: false } }, { user_id: null }] },
        { email: userEmail },
      ],
    });
  }

  return { $or: accessFilters };
};

const linkLegacyBulkOrdersToCustomer = async (req: AuthRequest) => {
  const userEmail = clean(req.user?.email).toLowerCase();
  if (!req.userId || !userEmail) return;

  await BulkOrder.updateMany(
    {
      $or: [{ user_id: { $exists: false } }, { user_id: null }],
      email: userEmail,
    },
    { $set: { user_id: req.userId } }
  );
};

export const createBulkOrder = asyncHandler(async (req: Request, res: Response) => {
  const uploadedFiles = (req.files as Express.Multer.File[]) || [];
  const authReq = req as AuthRequest;

  try {
    validateUploadedFiles(uploadedFiles);

    const payload = req.body.payload ? JSON.parse(req.body.payload) : req.body;
    const errors: Record<string, string> = {};

    const organizationName = clean(payload.organizationName);
    const contactPerson = clean(payload.contactPerson);
    const email = clean(payload.email).toLowerCase();
    const phone = clean(payload.phone);
    const deliveryAddress = clean(payload.deliveryAddress);
    const city = clean(payload.city);
    const state = clean(payload.state);
    const pincode = clean(payload.pincode);
    const requiredDate = new Date(payload.requiredDate);
    const estimatedBudget = Number(payload.estimatedBudget);
    const productsInput = Array.isArray(payload.products) ? payload.products : [];

    if (!organizationName) errors.organizationName = 'Organization name is required';
    if (!contactPerson) errors.contactPerson = 'Contact person is required';
    if (!email || !isValidEmail(email)) errors.email = 'Valid email is required';
    if (!phone || !isValidPhone(phone)) errors.phone = 'Valid phone number is required';
    if (!deliveryAddress) errors.deliveryAddress = 'Delivery address is required';
    if (!city) errors.city = 'City is required';
    if (!state) errors.state = 'State is required';
    if (!pincode || !isValidPincode(pincode)) errors.pincode = 'Valid 6-digit pincode is required';
    if (!payload.requiredDate || Number.isNaN(requiredDate.getTime())) {
      errors.requiredDate = 'Required date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(requiredDate);
      selected.setHours(0, 0, 0, 0);
      if (selected < today) errors.requiredDate = 'Required date cannot be in the past';
    }
    if (!Number.isFinite(estimatedBudget) || estimatedBudget < 0) errors.estimatedBudget = 'Estimated budget must be zero or more';
    if (productsInput.length === 0) errors.products = 'At least one product is required';

    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, JSON.stringify({ message: 'Validation failed', errors }));
    }

    const products = [];
    let grandTotalQuantity = 0;

    for (let index = 0; index < productsInput.length; index += 1) {
      const item = productsInput[index];
      const productKey = clean(item.productKey) || String(index);
      const isCustomProduct = item.isCustomProduct === true || item.productId === 'custom';
      const productErrors: string[] = [];
      let categoryId: mongoose.Types.ObjectId | undefined;
      let categoryName = clean(item.categoryName);
      let productId: mongoose.Types.ObjectId | undefined;
      let productName = clean(item.productName);
      let sku = clean(item.sku);

      if (!clean(item.categoryId)) {
        productErrors.push('category is required');
      } else if (!mongoose.Types.ObjectId.isValid(item.categoryId)) {
        productErrors.push('category is invalid');
      } else {
        const category = await Category.findById(item.categoryId);
        if (!category) {
          productErrors.push('category was not found');
        } else {
          categoryId = category._id as mongoose.Types.ObjectId;
          categoryName = category.name;
        }
      }

      if (isCustomProduct) {
        if (!productName) productErrors.push('custom product name is required');
      } else if (!clean(item.productId) || !mongoose.Types.ObjectId.isValid(item.productId)) {
        productErrors.push('product is required');
      } else {
        const product = await Product.findById(item.productId).populate('category_id', 'name');
        if (!product) {
          productErrors.push('product was not found');
        } else {
          productId = product._id as mongoose.Types.ObjectId;
          productName = product.name;
          sku = product.slug;
          const productCategoryId = (product.category_id as any)?._id || product.category_id;
          if (categoryId && productCategoryId && productCategoryId.toString() !== categoryId.toString()) {
            productErrors.push('product does not belong to selected category');
          }
        }
      }

      const sizeQuantities: Record<string, number> = {};
      let sizeTotal = 0;
      APPAREL_SIZE_KEYS.forEach((size) => {
        const value = Number(item.sizeQuantities?.[size] || 0);
        if (!Number.isFinite(value) || value < 0) productErrors.push(`${size.toUpperCase()} quantity cannot be negative`);
        const safeValue = Math.max(0, Math.floor(value || 0));
        sizeQuantities[size] = safeValue;
        sizeTotal += safeValue;
      });

      const generalQuantityRaw = Number(item.generalQuantity || 0);
      if (!Number.isFinite(generalQuantityRaw) || generalQuantityRaw < 0) {
        productErrors.push('general quantity cannot be negative');
      }
      const generalQuantity = Math.max(0, Math.floor(generalQuantityRaw || 0));
      const totalQuantity = sizeTotal + generalQuantity;
      if (totalQuantity <= 0) productErrors.push('quantity must be greater than zero');

      const files = uploadedFiles.filter(file => file.fieldname === `attachments_${productKey}`);
      if (files.length === 0 && !clean(item.designRequirements)) {
        productErrors.push('design requirements or at least one uploaded file is required');
      }

      if (productErrors.length > 0) {
        throw new ApiError(400, `Product ${index + 1}: ${productErrors.join(', ')}`);
      }

      const attachments = files.map(file => ({
        product_key: productKey,
        original_file_name: file.originalname,
        stored_file_name: file.filename,
        file_url: getFileUrl(req, file),
        mime_type: file.mimetype,
        file_size: file.size,
      }));

      products.push({
        product_key: productKey,
        category_id: categoryId,
        category_name: categoryName,
        product_id: productId,
        product_name: productName,
        sku,
        is_custom_product: isCustomProduct,
        description: clean(item.description),
        specifications: clean(item.specifications),
        design_requirements: clean(item.designRequirements),
        size_quantities: sizeQuantities,
        general_quantity: generalQuantity,
        total_quantity: totalQuantity,
        attachments,
      });

      grandTotalQuantity += totalQuantity;
    }

    if (grandTotalQuantity <= 0) {
      throw new ApiError(400, 'Grand total quantity must be greater than zero');
    }

    const bulkOrder = await BulkOrder.create({
      user_id: authReq.userId || undefined,
      request_number: await generateRequestNumber(),
      organization_name: organizationName,
      contact_person: contactPerson,
      email,
      phone,
      delivery_address: deliveryAddress,
      city,
      state,
      pincode,
      required_date: requiredDate,
      estimated_budget: estimatedBudget,
      additional_notes: clean(payload.additionalNotes),
      grand_total_quantity: grandTotalQuantity,
      status: 'New',
      products,
    });

    res.status(201).json(new ApiResponse(201, {
      requestNumber: bulkOrder.request_number,
      bulkOrder,
    }, 'Bulk order request submitted successfully'));
  } catch (error) {
    if (error instanceof ApiError) {
      removeUploadedFiles(uploadedFiles);
    }
    throw error;
  }
});

export const getMyBulkOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    throw new ApiError(401, 'Authentication token required');
  }

  const {
    page = '1',
    limit = '10',
    search = '',
    status,
  } = req.query;

  await linkLegacyBulkOrdersToCustomer(req);

  const filter: any = getCustomerBulkOrderFilter(req);
  if (status && BULK_ORDER_STATUSES.includes(status as BulkOrderStatus)) {
    filter.status = status;
  }
  if (search) {
    filter.request_number = { $regex: search as string, $options: 'i' };
  }

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.min(25, Math.max(1, parseInt(limit as string, 10) || 10));

  const [items, total] = await Promise.all([
    BulkOrder.find(filter)
      .select('-admin_notes')
      .sort({ created_at: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    BulkOrder.countDocuments(filter),
  ]);

  res.status(200).json(new ApiResponse(200, {
    items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
    statuses: BULK_ORDER_STATUSES,
  }, 'My bulk orders retrieved successfully'));
});

export const getMyBulkOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    throw new ApiError(401, 'Authentication token required');
  }

  await linkLegacyBulkOrdersToCustomer(req);

  const bulkOrder = await BulkOrder.findOne({
    _id: req.params.id,
    ...getCustomerBulkOrderFilter(req),
  }).select('-admin_notes');

  if (!bulkOrder) {
    throw new ApiError(404, 'Bulk order not found');
  }

  res.status(200).json(new ApiResponse(200, bulkOrder, 'Bulk order retrieved successfully'));
});

export const getAdminBulkOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    page = '1',
    limit = '10',
    search = '',
    status,
    sort = 'created_at',
    order = 'desc',
  } = req.query;

  const filter: any = {};
  if (status && BULK_ORDER_STATUSES.includes(status as BulkOrderStatus)) {
    filter.status = status;
  }
  if (search) {
    const rx = { $regex: search as string, $options: 'i' };
    filter.$or = [
      { request_number: rx },
      { organization_name: rx },
      { contact_person: rx },
      { email: rx },
      { phone: rx },
    ];
  }

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 10));
  const sortOption: any = { [sort as string]: order === 'asc' ? 1 : -1 };

  const [items, total] = await Promise.all([
    BulkOrder.find(filter).sort(sortOption).skip((pageNum - 1) * limitNum).limit(limitNum),
    BulkOrder.countDocuments(filter),
  ]);

  res.status(200).json(new ApiResponse(200, {
    items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
    statuses: BULK_ORDER_STATUSES,
  }, 'Bulk orders retrieved successfully'));
});

export const getAdminBulkOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const bulkOrder = await BulkOrder.findById(id);
  if (!bulkOrder) {
    throw new ApiError(404, 'Bulk order not found');
  }
  res.status(200).json(new ApiResponse(200, bulkOrder, 'Bulk order retrieved successfully'));
});

export const updateAdminBulkOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { adminNotes } = req.body;
  const bulkOrder = await BulkOrder.findByIdAndUpdate(id, { admin_notes: clean(adminNotes) }, { new: true });
  if (!bulkOrder) {
    throw new ApiError(404, 'Bulk order not found');
  }
  res.status(200).json(new ApiResponse(200, bulkOrder, 'Bulk order updated successfully'));
});

export const updateAdminBulkOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  if (!BULK_ORDER_STATUSES.includes(status as BulkOrderStatus)) {
    throw new ApiError(400, `Invalid status. Allowed values: ${BULK_ORDER_STATUSES.join(', ')}`);
  }

  const update: any = { status };
  if (adminNotes !== undefined) update.admin_notes = clean(adminNotes);

  const bulkOrder = await BulkOrder.findByIdAndUpdate(id, update, { new: true });
  if (!bulkOrder) {
    throw new ApiError(404, 'Bulk order not found');
  }

  res.status(200).json(new ApiResponse(200, bulkOrder, 'Bulk order status updated successfully'));
});
