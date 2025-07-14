const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();


const authServiceProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  timeout: 5000, // 5 second timeout
  pathRewrite: {
    '^/api/auth': '', // Remove /api/auth prefix when forwarding
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.originalUrl} -> ${proxyReq.path}`);
    console.log('Request body:', req.body);

    if (req.body) {
      proxyReq.setHeader('Content-Type', 'application/json');
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Proxy response: ${proxyRes.statusCode} for ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    
    let errorMessage = 'Auth service unavailable';
    let statusCode = 502;
    
    if (err.code === 'ECONNREFUSED') {
      errorMessage = 'Auth service is not running';
      console.error(`Cannot connect to auth service at ${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}`);
    } else if (err.code === 'ETIMEDOUT') {
      errorMessage = 'Auth service timeout';
      statusCode = 504;
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.message : 'Service error'
    });
  }
});

// Apply proxy to all auth routes
router.use('/', authServiceProxy);

module.exports = router;