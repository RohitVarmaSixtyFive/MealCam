const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: 'No ID token provided' });

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // ✅ Create new Google user
      user = new User({
        name,
        email,
        googleId,
        role: 'user',
        lastLogin: new Date(),
      });
    } else {
      // ✅ Update existing user with Google ID if not present
      if (!user.googleId) user.googleId = googleId;
      user.lastLogin = new Date();
    }

    await user.save(); // ✅ Always save the user

    const token = jwt.sign({ userId: user._id , role: user.role}, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
    console.log(res);
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.status(401).json({ message: 'Invalid Google ID token' });
  }
});

module.exports = router;

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('role')
    .optional()
    .isIn(['user', 'admin', 'nutritionist'])
    .withMessage('Role must be either user, admin, or nutritionist')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, authController.registerUser);
router.post('/login', loginValidation, authController.loginUser);
router.get('/me', authMiddleware, authController.getCurrentUser);
router.post('/refresh', authMiddleware, authController.refreshToken);

module.exports = router;