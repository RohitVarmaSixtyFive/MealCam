const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.AUTH_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Auth Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Auth Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
