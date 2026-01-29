import mongoose, { Document } from 'mongoose';

export interface ICartItem extends Document {
    user_id: mongoose.Types.ObjectId;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    size: string;
    color: string;
    created_at: Date;
    updated_at: Date;
}

const cartItemSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    color: { type: String, required: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

cartItemSchema.index({ user_id: 1, product_id: 1, size: 1, color: 1 }, { unique: true });

export const CartItem = mongoose.model<ICartItem>('CartItem', cartItemSchema);
