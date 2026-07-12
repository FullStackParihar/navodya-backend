const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

async function seedCategory() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const existing = await Category.findOne({ slug: 'alumni-kit' });
        if (existing) {
            console.log('Alumni Kit category already exists:', existing._id);
        } else {
            const newCat = await Category.create({
                name: 'Alumni Kit',
                slug: 'alumni-kit',
                description: 'Complete kit for our esteemed alumni'
            });
            console.log('Created Alumni Kit category:', newCat._id);
        }
        process.exit(0);
    } catch (err) {
        console.error('Error seeding category:', err);
        process.exit(1);
    }
}

seedCategory();
