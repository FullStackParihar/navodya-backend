import mongoose from 'mongoose';
import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import { config } from '../config/env.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log('Connected to MongoDB for seeding...');

        // 1. Create Categories
        const categoriesData = [
            { name: 'T-Shirts', slug: 'tshirts', description: 'Premium JNV T-Shirts' },
            { name: 'Hoodies', slug: 'hoodies', description: 'Comfortable JNV Hoodies' },
            { name: 'Accessories', slug: 'accessories', description: 'JNV Branded Accessories' },
            { name: 'Alumni Kits', slug: 'alumni-kits', description: 'Complete Alumni Packages' },
        ];

        const categories = [];
        for (const cat of categoriesData) {
            let category = await Category.findOne({ slug: cat.slug });
            if (!category) {
                category = await Category.create(cat);
                console.log(`Created category: ${cat.name}`);
            }
            categories.push(category);
        }

        const catMap = categories.reduce((acc, cat) => {
            acc[cat.slug] = cat._id;
            return acc;
        }, {} as any);

        // 2. Create sample products if none exist or update existing ones
        const productsData = [
            {
                name: 'JNV Classic T-Shirt',
                slug: 'jnv-classic-tshirt',
                description: 'Premium Cotton | Custom Design',
                price: 599,
                sale_price: 399,
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop'],
                category_id: catMap['tshirts'],
                sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 20 }, { size: 'L', stock: 15 }],
                colors: [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }],
                tags: ['classic', 'tshirt'],
                rating: 4.5,
                review_count: 245
            },
            {
                name: 'JNV Alumni Hoodie',
                slug: 'jnv-alumni-hoodie',
                description: 'Fleece Fabric | Batch 2020',
                price: 999,
                sale_price: 799,
                images: ['https://images.unsplash.com/photo-1556821840-3a5f3d5fb6c7?w=800&h=600&fit=crop'],
                category_id: catMap['hoodies'],
                sizes: [{ size: 'M', stock: 15 }, { size: 'L', stock: 25 }, { size: 'XL', stock: 10 }],
                colors: [{ name: 'Navy', hex: '#000080' }, { name: 'Gray', hex: '#808080' }],
                tags: ['hoodie', 'alumni'],
                rating: 4.8,
                review_count: 189
            },
            {
                name: 'JNV Baseball Cap',
                slug: 'jnv-baseball-cap',
                description: 'Adjustable | Embroidered Logo',
                price: 399,
                sale_price: 299,
                images: ['https://images.unsplash.com/photo-1513519245088-0e7839c3c889?w=800&h=600&fit=crop'],
                category_id: catMap['accessories'],
                sizes: [{ size: 'Free Size', stock: 50 }],
                colors: [{ name: 'Black', hex: '#000000' }],
                tags: ['cap', 'accessories'],
                rating: 4.2,
                review_count: 156
            }
        ];

        for (const prod of productsData) {
            const existing = await Product.findOne({ slug: prod.slug });
            if (!existing) {
                await Product.create(prod);
                console.log(`Created product: ${prod.name}`);
            } else {
                // Update existing product to use new category and data format
                await Product.findByIdAndUpdate(existing._id, prod);
                console.log(`Updated product: ${prod.name}`);
            }
        }

        // 3. Create Admin User
        const adminEmail = 'admin@navodaya.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123!@#', 10);
            await User.create({
                name: 'Admin User',
                email: adminEmail,
                password_hash: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created');
        } else {
            // Update password if admin exists to match demo credentials
            const hashedPassword = await bcrypt.hash('admin123!@#', 10);
            await User.findOneAndUpdate({ email: adminEmail }, { password_hash: hashedPassword, role: 'admin' });
            console.log('Admin user password updated');
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
