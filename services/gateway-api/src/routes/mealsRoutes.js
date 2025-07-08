const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

// Proxy all meals requests to meals service
const mealsProxy = createProxyMiddleware({
  target: process.env.MEALS_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/meals': '/api/meals'
  },
  onError: (err, req, res) => {
    console.error('Meals service proxy error:', err);
    res.status(503).json({
      success: false,
      message: 'Meals service unavailable'
    });
  }
});

// Proxy nutrition requests to meals service
const nutritionProxy = createProxyMiddleware({
  target: process.env.MEALS_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/meals/nutrition': '/api/nutrition'
  },
  onError: (err, req, res) => {
    console.error('Nutrition service proxy error:', err);
    res.status(503).json({
      success: false,
      message: 'Nutrition service unavailable'
    });
  }
});

router.use('/nutrition', nutritionProxy);
router.use('/', mealsProxy);

module.exports = router;
