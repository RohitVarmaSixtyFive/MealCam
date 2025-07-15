const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Endpoint to verify token for gateway auth middleware
router.get('/verify', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    return res.json({
      success: true,
      user: {
        userId: decoded.userId,
        role: decoded.role
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
