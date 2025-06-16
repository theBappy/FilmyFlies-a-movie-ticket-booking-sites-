import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
    });

    console.log('✅ Mongoose.connect resolved.');

    // Important: lowercase 'connected'
    mongoose.connection.on('connected', () => {
      console.log('✅ Database connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected');
    });
  } catch (error) {
    console.error('❌ DB Connection Failed:', error.message);
  }
};

export default connectDB;
