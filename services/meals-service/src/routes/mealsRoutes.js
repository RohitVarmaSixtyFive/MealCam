const express = require('express');
const router = express.Router();
const mealsController = require('../controllers/mealsController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Meal CRUD operations
router.get('/', mealsController.getMeals);
router.post('/', mealsController.createMeal);
router.get('/:id', mealsController.getMealById);
router.delete('/:id', mealsController.deleteMeal);

// Image upload endpoint (temporary, not saved to DB)
router.post('/upload-photo', mealsController.upload.single('image'), mealsController.uploadMealPhoto);

// Nutrition calculation endpoint
router.post('/nutrition', mealsController.getNutritionDetails);

module.exports = router;