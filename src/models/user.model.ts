import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password_hash: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    jnvSchool?: string;
    batchYear?: string;
    role: 'user' | 'admin';
    created_at: Date;
    updated_at: Date;
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    bio: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    jnvSchool: { type: String },
    batchYear: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export const User = mongoose.model<IUser>('User', userSchema);
