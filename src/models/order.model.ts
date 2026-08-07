import mongoose, { Document } from 'mongoose';

export interface IOrderItem {
    product_id: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    fabric_variant_id?: mongoose.Types.ObjectId;
    fabric_name?: string;
    fabric_price?: number;
}

export interface IOrderStatusHistory {
    status: string;
    changed_at: Date;
    note?: string;
    changed_by?: string; // admin user id or name
}

export interface IOrderTracking {
    carrier?: string;
    tracking_number?: string;
    url?: string;
}

export interface IOrder extends Document {
    user_id: mongoose.Types.ObjectId;
    items: IOrderItem[];
    shipping_address: {
        firstname?: string;
        lastname?: string;
        phone?: string;
        street: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
    };
    billing_address?: {
        firstname?: string;
        lastname?: string;
        phone?: string;
        street: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
    };
    payment_info: {
        id: string; // Stripe PaymentIntent ID or Cashfree order_id
        payment_session_id?: string;
        cf_order_id?: string;
        status: 'PENDING' | 'PAID' | 'FAILED';
        method: string;
        transaction_details?: any;
    };
    pricing: {
        subtotal: number;
        tax: number;
        shipping_fee: number;
        discount: number;
        total: number;
    };
    coupon_applied?: mongoose.Types.ObjectId;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
    status_history: IOrderStatusHistory[];
    tracking?: IOrderTracking;
    created_at: Date;
    updated_at: Date;
}

const orderStatusHistorySchema = new mongoose.Schema({
    status: { type: String, required: true },
    changed_at: { type: Date, default: Date.now },
    note: { type: String },
    changed_by: { type: String }
}, { _id: false });

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
        ,fabric_variant_id: mongoose.Schema.Types.ObjectId
        ,fabric_name: String
        ,fabric_price: { type: Number, min: 0 }
    }],
    shipping_address: {
        firstname: { type: String },
        lastname: { type: String },
        phone: { type: String },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip_code: { type: String, required: true },
        country: { type: String, required: true }
    },
    billing_address: {
        firstname: { type: String },
        lastname: { type: String },
        phone: { type: String },
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip_code: { type: String },
        country: { type: String }
    },
    payment_info: {
        id: { type: String },
        payment_session_id: { type: String },
        cf_order_id: { type: String },
        status: {
            type: String,
            enum: ['PENDING', 'PAID', 'FAILED'],
            default: 'PENDING'
        },
        method: { type: String, default: 'card' },
        transaction_details: { type: mongoose.Schema.Types.Mixed }
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
        enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'],
        default: 'PENDING'
    },
    // Immutable audit trail of every status change
    status_history: {
        type: [orderStatusHistorySchema],
        default: []
    },
    // Optional shipment tracking details
    tracking: {
        carrier: { type: String },
        tracking_number: { type: String },
        url: { type: String }
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);
