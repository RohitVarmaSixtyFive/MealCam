const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Nutrition tracking routes
router.get('/daily', nutritionController.getDailyNutrition);
router.get('/weekly', nutritionController.getWeeklyNutrition);

module.exports = router;
