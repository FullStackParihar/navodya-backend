import mongoose, { Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    sale_price?: number;
    images: string[];
    category_id: mongoose.Types.ObjectId;
    subcategory?: string;
    sizes: { size: string; stock: number }[];
    colors: { name: string; hex?: string; images?: string[] }[];
    tags: string[];
    features?: string[];
    specifications?: Record<string, string>;
    rating: number;
    review_count: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    sale_price: { type: Number },
    images: [String],
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subcategory: { type: String },
    sizes: [{ size: String, stock: Number }],
    colors: [{ name: String, hex: String, images: [String] }],
    tags: [String],
    features: [String],
    specifications: { type: Map, of: String },
    rating: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
