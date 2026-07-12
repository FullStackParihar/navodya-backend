import mongoose, { Document } from 'mongoose';

export interface IFavorite extends Document {
    user_id: mongoose.Types.ObjectId;
    product_id: mongoose.Types.ObjectId;
    fabric_variant_id?: mongoose.Types.ObjectId;
    fabric_name?: string;
    fabric_price?: number;
    created_at: Date;
    updated_at: Date;
}

const favoriteSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    fabric_variant_id: { type: mongoose.Schema.Types.ObjectId },
    fabric_name: { type: String },
    fabric_price: { type: Number, min: 0 }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

favoriteSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', favoriteSchema);
