/*
 * PLACEHOLDER: Rate Limiting Middleware
 * 
 * Advanced rate limiting for the API Gateway:
 * 
 * Features to implement:
 * - User-based rate limiting
 * - IP-based rate limiting
 * - Endpoint-specific limits
 * - Burst protection
 * - Distributed rate limiting (Redis)
 * 
 * Limits by service:
 * - Auth: Lower limits for login/register
 * - Meals: Medium limits for CRUD operations
 * - AI: Strict limits due to processing costs
 * 
 * Response headers:
 * - X-RateLimit-Limit
 * - X-RateLimit-Remaining
 * - X-RateLimit-Reset
 */

const rateLimit = require('express-rate-limit');

// Different rate limits for different services
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    standardHeaders: true,
    legacyHeaders: false,
    // TODO: Add Redis store for distributed rate limiting
    // store: new RedisStore({...})
  });
};

// Auth service rate limiting (stricter for auth endpoints)
const authRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // 10 requests per window
  'Too many authentication requests, please try again later'
);

// Meals service rate limiting
const mealsRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  'Too many meal requests, please try again later'
);

// AI service rate limiting (very strict)
const aiRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  20, // 20 requests per window
  'Too many AI requests, please try again later'
);

module.exports = {
  authRateLimit,
  mealsRateLimit,
  aiRateLimit
};
