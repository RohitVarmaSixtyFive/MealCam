/*
 * PLACEHOLDER: Auth Middleware for Meals Service
 * 
 * This middleware should verify JWT tokens sent from the API Gateway
 * and extract user information for meal operations.
 * 
 * Implementation needed:
 * - JWT token verification
 * - User ID extraction
 * - Role-based access control
 * - Integration with auth service for token validation
 * - Error handling for invalid/expired tokens
 */

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

    // TODO: Verify token with auth service or shared secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = authMiddleware;
