const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Nutrition tracking routes
router.get('/daily', nutritionController.getDailyNutrition);

// TODO: Add remaining nutrition routes
// router.get('/weekly', nutritionController.getWeeklyNutrition);
// router.get('/monthly', nutritionController.getMonthlyNutrition);
// router.get('/goals', nutritionController.getNutritionGoals);
// router.post('/goals', nutritionController.setNutritionGoals);
// router.get('/foods/search', nutritionController.getFoodDatabase);
// router.post('/foods/custom', nutritionController.addCustomFood);
// router.get('/insights', nutritionController.getNutritionInsights);
// router.get('/export', nutritionController.exportNutritionData);

module.exports = router;
