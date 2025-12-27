import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/gearguard';

    if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
      console.warn('Warning: No `MONGODB_URI` or `MONGO_URI` found in environment — using local fallback:', mongoURI);
      console.warn('For production, create a `backend/.env` file with `MONGODB_URI=` set to your MongoDB connection string.');
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
