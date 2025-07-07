const express = require('express');
const Meal = require('../models/Meal');
const auth = require('../middlewares/auth');
const { validateMeal } = require('../middlewares/validators');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/meals - Get user's meals with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      startDate, 
      endDate, 
      mealTitle 
    } = req.query;

    const query = { userId: req.user._id };

    // Date filtering
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Meal type filtering
    if (mealTitle) {
      query.mealTitle = mealTitle;
    }

    const meals = await Meal.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Meal.countDocuments(query);

    res.json({
      meals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalMeals: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({
      error: 'Failed to fetch meals',
      message: 'Something went wrong while fetching meals'
    });
  }
});

// GET /api/meals/:id - Get specific meal
router.get('/:id', async (req, res) => {
  try {
    const meal = await Meal.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!meal) {
      return res.status(404).json({
        error: 'Meal not found',
        message: 'The requested meal does not exist'
      });
    }

    res.json({ meal });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({
      error: 'Failed to fetch meal',
      message: 'Something went wrong while fetching the meal'
    });
  }
});

// POST /api/meals - Create new meal
router.post('/', validateMeal, async (req, res) => {
  try {
    const mealData = {
      ...req.body,
      userId: req.user._id
    };

    const meal = new Meal(mealData);
    await meal.save();

    res.status(201).json({
      message: 'Meal created successfully',
      meal
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({
      error: 'Failed to create meal',
      message: 'Something went wrong while creating the meal'
    });
  }
});

// PUT /api/meals/:id - Update meal
router.put('/:id', validateMeal, async (req, res) => {
  try {
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!meal) {
      return res.status(404).json({
        error: 'Meal not found',
        message: 'The requested meal does not exist'
      });
    }

    res.json({
      message: 'Meal updated successfully',
      meal
    });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({
      error: 'Failed to update meal',
      message: 'Something went wrong while updating the meal'
    });
  }
});

// DELETE /api/meals/:id - Delete meal
router.delete('/:id', async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!meal) {
      return res.status(404).json({
        error: 'Meal not found',
        message: 'The requested meal does not exist'
      });
    }

    res.json({
      message: 'Meal deleted successfully'
    });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({
      error: 'Failed to delete meal',
      message: 'Something went wrong while deleting the meal'
    });
  }
});

// GET /api/meals/stats/daily - Get daily nutrition stats
router.get('/stats/daily', async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.query;
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      userId: req.user._id,
      timestamp: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    const dailyTotals = meals.reduce((acc, meal) => {
      acc.calories += meal.totals.calories;
      acc.protein += meal.totals.protein;
      acc.carbs += meal.totals.carbs;
      acc.fat += meal.totals.fat;
      acc.fiber += meal.totals.fiber;
      acc.sugar += meal.totals.sugar;
      acc.sodium += meal.totals.sodium;
      return acc;
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    });

    res.json({
      date,
      meals: meals.length,
      totals: dailyTotals,
      goals: req.user.preferences
    });
  } catch (error) {
    console.error('Get daily stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch daily stats',
      message: 'Something went wrong while fetching daily statistics'
    });
  }
});

module.exports = router;
