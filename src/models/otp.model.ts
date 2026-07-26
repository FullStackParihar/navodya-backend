import mongoose, { Document } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  created_at: Date;
}

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    created_at: { type: Date, default: Date.now, expires: 300 }, // Expire document in 5 minutes
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Otp = mongoose.model<IOtp>('Otp', otpSchema);
