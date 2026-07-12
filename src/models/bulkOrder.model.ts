import mongoose, { Document } from 'mongoose';

export const BULK_ORDER_STATUSES = [
  'New',
  'Under Review',
  'Contacted',
  'Quotation Sent',
  'Approved',
  'In Production',
  'Completed',
  'Rejected',
  'Cancelled',
] as const;

export type BulkOrderStatus = typeof BULK_ORDER_STATUSES[number];

export interface IBulkOrderAttachment {
  product_key: string;
  original_file_name: string;
  stored_file_name: string;
  file_url: string;
  mime_type: string;
  file_size: number;
}

export interface IBulkOrderProduct {
  product_key: string;
  category_id?: mongoose.Types.ObjectId;
  category_name: string;
  product_id?: mongoose.Types.ObjectId;
  product_name: string;
  sku?: string;
  is_custom_product: boolean;
  description?: string;
  specifications?: string;
  design_requirements?: string;
  size_quantities: Record<string, number>;
  general_quantity: number;
  total_quantity: number;
  attachments: IBulkOrderAttachment[];
}

export interface IBulkOrder extends Document {
  user_id?: mongoose.Types.ObjectId;
  request_number: string;
  organization_name: string;
  contact_person: string;
  email: string;
  phone: string;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  required_date: Date;
  estimated_budget: number;
  additional_notes?: string;
  grand_total_quantity: number;
  status: BulkOrderStatus;
  admin_notes?: string;
  customer_message?: string;
  products: IBulkOrderProduct[];
  created_at: Date;
  updated_at: Date;
}

const attachmentSchema = new mongoose.Schema({
  product_key: { type: String, required: true },
  original_file_name: { type: String, required: true },
  stored_file_name: { type: String, required: true },
  file_url: { type: String, required: true },
  mime_type: { type: String, required: true },
  file_size: { type: Number, required: true },
}, { _id: false });

const bulkOrderProductSchema = new mongoose.Schema({
  product_key: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  category_name: { type: String, required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  product_name: { type: String, required: true },
  sku: { type: String },
  is_custom_product: { type: Boolean, default: false },
  description: { type: String },
  specifications: { type: String },
  design_requirements: { type: String },
  size_quantities: {
    xs: { type: Number, default: 0, min: 0 },
    s: { type: Number, default: 0, min: 0 },
    m: { type: Number, default: 0, min: 0 },
    l: { type: Number, default: 0, min: 0 },
    xl: { type: Number, default: 0, min: 0 },
    xxl: { type: Number, default: 0, min: 0 },
    '3xl': { type: Number, default: 0, min: 0 },
    '4xl': { type: Number, default: 0, min: 0 },
  },
  general_quantity: { type: Number, default: 0, min: 0 },
  total_quantity: { type: Number, required: true, min: 0 },
  attachments: { type: [attachmentSchema], default: [] },
}, { _id: false });

const bulkOrderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  request_number: { type: String, required: true, unique: true, index: true },
  organization_name: { type: String, required: true },
  contact_person: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  delivery_address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  required_date: { type: Date, required: true },
  estimated_budget: { type: Number, required: true, min: 0 },
  additional_notes: { type: String },
  grand_total_quantity: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: BULK_ORDER_STATUSES,
    default: 'New',
    index: true,
  },
  admin_notes: { type: String },
  customer_message: { type: String },
  products: { type: [bulkOrderProductSchema], default: [] },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

bulkOrderSchema.index({ created_at: -1 });
bulkOrderSchema.index({ organization_name: 'text', contact_person: 'text', email: 'text', phone: 'text', request_number: 'text' });

export const BulkOrder = mongoose.model<IBulkOrder>('BulkOrder', bulkOrderSchema);
