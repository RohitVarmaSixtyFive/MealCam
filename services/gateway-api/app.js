const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const authRoutes = require('./src/routes/authRoutes');
const mealsRoutes = require('./src/routes/mealsRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const authMiddleware = require('./src/middleware/auth');

const app = express();

// Security and performance middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'gateway-api',
    timestamp: new Date().toISOString(),
    services: {
      auth: process.env.AUTH_SERVICE_URL,
      meals: process.env.MEALS_SERVICE_URL,
      ai: process.env.AI_SERVICE_URL
    }
  });
});

// API routes with service proxying
app.use('/api/auth', authRoutes);
app.use('/api/meals', authMiddleware, mealsRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Gateway Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.GATEWAY_PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Service URLs:');
  console.log(`- Auth Service: ${process.env.AUTH_SERVICE_URL}`);
  console.log(`- Meals Service: ${process.env.MEALS_SERVICE_URL}`);
  console.log(`- AI Service: ${process.env.AI_SERVICE_URL}`);
});

module.exports = app;
