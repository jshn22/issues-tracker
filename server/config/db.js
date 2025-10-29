const mongoose = require('mongoose');

const connectDB = async () => {
  // Support either MONGO_URI (local) or DATABASE_URL (Atlas). Prefer DATABASE_URL if provided.
  const uri = process.env.DATABASE_URL || process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI or DATABASE_URL not set in environment');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
