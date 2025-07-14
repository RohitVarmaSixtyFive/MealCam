require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Meals Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Meals Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
