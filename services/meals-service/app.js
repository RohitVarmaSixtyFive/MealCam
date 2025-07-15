const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/database');
const mealsRoutes = require('./src/routes/mealsRoutes');
const nutritionRoutes = require('./src/routes/nutritionRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// // Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // higher limit for meals service due to image uploads
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' })); // Higher limit for images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'meals-service',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/meals', mealsRoutes);
app.use('/api/nutrition', nutritionRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.MEALS_SERVICE_PORT || 3002;

app.listen(PORT, () => {
  console.log(`Meals Service running on port ${PORT}`);
});

module.exports = app;
