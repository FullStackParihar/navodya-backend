import mongoose, { Document, Schema } from 'mongoose';

export interface ISubcategory extends Document {
  categoryId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  image?: string;
  imagePublicId?: string;
  description?: string;
  price?: number;
  salePrice?: number;
  stock?: number;
  displayOrder: number;
  isActive: boolean;
  status?: string;
  created_at: Date;
  updated_at: Date;
}

const subcategorySchema = new Schema<ISubcategory>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    image: { type: String, trim: true, default: '' },
    imagePublicId: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, default: 999 },
    salePrice: { type: Number, default: 799 },
    stock: { type: Number, default: 50 },
    displayOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for status string
subcategorySchema.virtual('status').get(function () {
  return this.isActive ? 'active' : 'inactive';
});

// Ensure unique slug per parent category
subcategorySchema.index({ categoryId: 1, slug: 1 }, { unique: true });

export const Subcategory = mongoose.model<ISubcategory>('Subcategory', subcategorySchema);
export default Subcategory;
