import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    role: String
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not defined');
        process.exit(1);
    }
    await mongoose.connect(uri);
    const users = await User.find({}, 'email name role').limit(20);
    console.log('Users in DB:');
    console.log(JSON.stringify(users, null, 2));
    await mongoose.disconnect();
}

main().catch(console.error);
