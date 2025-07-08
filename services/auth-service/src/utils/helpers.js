const crypto = require('crypto');

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Format user response (remove sensitive data)
const formatUserResponse = (user) => {
  const { password, __v, ...userResponse } = user.toObject ? user.toObject() : user;
  return userResponse;
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Calculate password strength
const calculatePasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
  return { score, strength };
};

module.exports = {
  generateRandomString,
  sanitizeInput,
  formatUserResponse,
  isValidEmail,
  calculatePasswordStrength
};
