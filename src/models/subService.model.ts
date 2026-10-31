import mongoose, { Document, Schema } from 'mongoose';

export interface ISubService extends Document {
  serviceId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  image: string;
  imagePublicId?: string;
  description?: string;
  price?: number;
  features?: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subServiceSchema = new Schema<ISubService>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    image: { type: String, required: true, trim: true },
    imagePublicId: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, default: 0 },
    features: [{ type: String, trim: true }],
    displayOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

subServiceSchema.index({ serviceId: 1, slug: 1 }, { unique: true });

export const SubService = mongoose.model<ISubService>('SubService', subServiceSchema);
export default SubService;
