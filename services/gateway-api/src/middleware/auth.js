const jwt = require('jsonwebtoken');
const axios = require('axios');

/**
 * Gateway authentication middleware.
 * Verifies JWT locally, falls back to auth-service if local validation fails.
 */
async function authMiddleware(req, res, next) {
  // Extract token from Authorization header
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  // Attempt local verification
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (localError) {
    // Fallback: verify with auth service
    try {
      const response = await axios.get(
        `${process.env.AUTH_SERVICE_URL}/api/auth/verify`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 }
      );

      if (response.data.success) {
        req.user = response.data.user;
        return next();
      }
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    } catch (serviceError) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  }
}

module.exports = authMiddleware;
