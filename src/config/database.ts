import mongoose from 'mongoose';
import { config } from './env.js';
import dns from 'dns';

export const connectDB = async () => {
    try {
        // Fix for Node.js Windows IPv6 DNS bug causing querySrv ECONNREFUSED
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        
        const conn = await mongoose.connect(config.mongodb.uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};
