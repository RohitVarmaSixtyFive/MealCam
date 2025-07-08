const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Register new user
const registerUser = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(error => error.msg)
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Clean the password (remove any whitespace)
    const cleanPassword = password.trim();
    
    console.log("=== REGISTRATION DEBUG ===");
    console.log("email :", email);
    console.log("Clean password:", cleanPassword);
    console.log("Password length:", cleanPassword.length);
    
    // Hash password with consistent salt rounds
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(cleanPassword, saltRounds);

    console.log("Salt rounds used:", saltRounds);
    console.log("Hashed password:", hashedPassword);
    
    // Create user
    const user = new User({
      name,
      email,
      passwordHash: hashedPassword,
      role: role || 'user'
    });

    console.log("Hashed password:", hashedPassword);


    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

// Login user
const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(error => error.msg)
      });
    }

    const { email, password } = req.body;

    // Clean the password (remove any whitespace)
    const cleanPassword = password.trim();

    console.log("Login attempt for email:", email);
    console.log("Clean password:", cleanPassword);
    
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log("User found:", user.email);
    console.log("Stored passwordHash:", user.passwordHash);

    // Verify the stored hash is valid
    if (!user.passwordHash || !user.passwordHash.startsWith('$2')) {
      console.log("Invalid hash format in database");
      return res.status(500).json({
        success: false,
        message: 'Authentication system error'
      });
    }

    // Compare passwords using bcrypt.compare
    const isPasswordValid = await bcrypt.compare(cleanPassword, user.passwordHash);
    console.log("Password comparison result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Password comparison failed");
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

// Get current user profile
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
const refreshToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshToken
};

// Clean password: Rohit@2005; Hashed password: $2a$12$fdoxU74HabniUFokMzyGr.fvu0JNubNQvoO//DYWF6eI90LKIECdS
// Clean password: Rohit@2005; Stored passwordHash: $2a$12$X6NjbkwupYCoxma6HNYGwOejZNYweKSl7MUh3u5DLMsQ4rrqRJK1e