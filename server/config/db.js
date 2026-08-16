import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set in your .env file');
  }

  const conn = await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;
