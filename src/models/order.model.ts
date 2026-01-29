import mongoose, { Document } from 'mongoose';

export interface IOrderItem {
    product_id: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
}

export interface IOrder extends Document {
    user_id: mongoose.Types.ObjectId;
    items: IOrderItem[];
    shipping_address: {
        street: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
    };
    payment_info: {
        id: string; // Stripe PaymentIntent ID
        status: 'PENDING' | 'PAID' | 'FAILED';
        method: string;
    };
    pricing: {
        subtotal: number;
        tax: number;
        shipping_fee: number;
        discount: number;
        total: number;
    };
    coupon_applied?: mongoose.Types.ObjectId;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    created_at: Date;
    updated_at: Date;
}

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: String,
        color: String
    }],
    shipping_address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip_code: { type: String, required: true },
        country: { type: String, required: true }
    },
    payment_info: {
        id: { type: String },
        status: {
            type: String,
            enum: ['PENDING', 'PAID', 'FAILED'],
            default: 'PENDING'
        },
        method: { type: String, default: 'card' }
    },
    pricing: {
        subtotal: { type: Number, required: true },
        tax: { type: Number, default: 0 },
        shipping_fee: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true }
    },
    coupon_applied: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);
