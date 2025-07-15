const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Verify token with JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    
    // Extract user information from token
    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      name: decoded.name
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

module.exports = authMiddleware;
