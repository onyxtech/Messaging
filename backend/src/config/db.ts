import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/messaging";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected');

    } catch (error) {
        console.error('❌ MongoDB connection error', error);
        process.exit(1);
    }
};
