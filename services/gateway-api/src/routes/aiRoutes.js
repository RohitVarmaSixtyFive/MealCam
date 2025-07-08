const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

// Proxy all AI requests to AI parser service
const aiProxy = createProxyMiddleware({
  target: process.env.AI_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/ai': '/api/ai'
  },
  timeout: 60000, // 60 seconds for AI processing
  onError: (err, req, res) => {
    console.error('AI service proxy error:', err);
    res.status(503).json({
      success: false,
      message: 'AI service unavailable'
    });
  }
});

router.use('/', aiProxy);

module.exports = router;
