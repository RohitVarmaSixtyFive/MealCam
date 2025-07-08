const express = require('express');
const router = express.Router();
const mealsController = require('../controllers/mealsController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Meal CRUD operations
router.get('/', mealsController.getMeals);
router.post('/', mealsController.createMeal);

// TODO: Add remaining routes
// router.get('/:id', mealsController.getMealById);
// router.put('/:id', mealsController.updateMeal);
// router.delete('/:id', mealsController.deleteMeal);
// router.post('/upload', mealsController.uploadMealImage);
// router.get('/history/:userId', mealsController.getUserMealHistory);
// router.get('/search', mealsController.searchMeals);
// router.post('/:id/like', mealsController.likeMeal);
// router.get('/public', mealsController.getPublicMeals);

module.exports = router;
