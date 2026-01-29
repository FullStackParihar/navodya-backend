import mongoose, { Document } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    min_order_amount?: number;
    max_discount_amount?: number;
    valid_from: Date;
    valid_until: Date;
    usage_limit?: number;
    usage_count: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    isValid(): boolean;
}

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['PERCENTAGE', 'FIXED'],
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: 0
    },
    min_order_amount: {
        type: Number,
        default: 0
    },
    max_discount_amount: {
        type: Number
    },
    valid_from: {
        type: Date,
        default: Date.now
    },
    valid_until: {
        type: Date,
        required: true
    },
    usage_limit: {
        type: Number
    },
    usage_count: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
    const now = new Date();
    return (
        this.is_active &&
        this.valid_from <= now &&
        this.valid_until >= now &&
        (this.usage_limit ? this.usage_count < this.usage_limit : true)
    );
};

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
