import mongoose, { Document } from 'mongoose';

export interface IReview extends Document {
    user_id: mongoose.Types.ObjectId;
    product_id: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
}

const reviewSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Prevent duplicate reviews from the same user for the same product
reviewSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
