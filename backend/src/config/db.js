import mongoose from 'mongoose';
import env from './env.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      // modern mongoose uses URI only; options kept minimal
    });
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error', error);
    process.exit(1);
  }
};

