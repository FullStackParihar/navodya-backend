import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  imageUrl: string;
  imagePublicId: string;
  title: string;
  subtitle: string;
  offerText: string;
  buttonText: string;
  buttonLink: string;
  displayOrder: number;
  isActive: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>({
  imageUrl: { type: String, required: true, trim: true },
  imagePublicId: { type: String, required: true, trim: true, select: false },
  title: { type: String, trim: true, maxlength: 120, default: '' },
  subtitle: { type: String, trim: true, maxlength: 300, default: '' },
  offerText: { type: String, trim: true, maxlength: 100, default: '' },
  buttonText: { type: String, trim: true, maxlength: 50, default: '' },
  buttonLink: { type: String, trim: true, maxlength: 500, default: '' },
  displayOrder: { type: Number, required: true, min: 0, default: 0, index: true },
  isActive: { type: Boolean, default: true, index: true },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
}, { timestamps: true });

bannerSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.model<IBanner>('Banner', bannerSchema);
