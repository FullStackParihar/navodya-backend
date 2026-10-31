import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  image: string;
  imagePublicId?: string;
  description?: string;
  badge?: string; // e.g. "NEW"
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    image: { type: String, required: true, trim: true },
    imagePublicId: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    badge: { type: String, trim: true, default: null },
    displayOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

serviceSchema.virtual('subServices', {
  ref: 'SubService',
  localField: '_id',
  foreignField: 'serviceId'
});

export const Service = mongoose.model<IService>('Service', serviceSchema);
export default Service;
