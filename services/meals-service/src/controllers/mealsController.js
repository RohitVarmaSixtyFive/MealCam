const Meal = require('../models/Meal');
const { validationResult } = require('express-validator');
const multer = require('multer');

// Configure multer for image uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to calculate nutrition based on quantity
const calculateNutrition = (items) => {
  let totalNutrition = {
    calories: 0,
    fat: 0,
    protein: 0,
    carbs: 0
  };

  items.forEach(item => {
    const quantity = item.quantity || 1;
    // Base nutrition per 1 unit (hardcoded as requested)
    const baseCalories = 250;
    const baseFat = 20;
    const baseProtein = 20;
    const baseCarbs = 20;

    totalNutrition.calories += baseCalories * quantity;
    totalNutrition.fat += baseFat * quantity;
    totalNutrition.protein += baseProtein * quantity;
    totalNutrition.carbs += baseCarbs * quantity;
  });

  return totalNutrition;
};

// Create meal with multiple items (name and quantity)
const createMeal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, description, mealType, items, date } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!title || !mealType || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title, mealType, and items array are required'
      });
    }

    // Validate items structure
    for (let item of items) {
      if (!item.name || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a name and positive quantity'
        });
      }
    }

    // Calculate nutrition based on items
    const nutrition = calculateNutrition(items);

    // Format ingredients for database
    const ingredients = items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit || 'piece'
    }));

    const meal = new Meal({
      userId,
      title,
      description: description || '',
      mealType,
      date: date || new Date(),
      nutrition,
      ingredients
    });

    const savedMeal = await meal.save();

    res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      data: savedMeal
    });

  } catch (error) {
    console.error('Create meal error:', error);
    next(error);
  }
};

// Upload meal photo (temporary, not saved to database)
const uploadMealPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // For now, just return success with file info (not saving to DB as requested)
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully (temporary)',
      data: {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        note: 'Image processed but not saved to database as requested'
      }
    });

  } catch (error) {
    console.error('Upload photo error:', error);
    next(error);
  }
};

// Get user's meals
const getMeals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, mealType, date } = req.query;

    // Build query filter
    let filter = { userId };
    
    if (mealType) {
      filter.mealType = mealType;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const meals = await Meal.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Meal.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: meals,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get meals error:', error);
    next(error);
  }
};

// Get specific meal by ID
const getMealById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const meal = await Meal.findOne({ _id: id, userId });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: meal
    });

  } catch (error) {
    console.error('Get meal by ID error:', error);
    next(error);
  }
};

// Get nutrition details for a meal or calculate for given items
const getNutritionDetails = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    // Validate items structure
    for (let item of items) {
      if (!item.name || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a name and positive quantity'
        });
      }
    }

    const nutrition = calculateNutrition(items);

    res.status(200).json({
      success: true,
      message: 'Nutrition calculated successfully',
      data: {
        items,
        nutrition,
        breakdown: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          calories: 250 * item.quantity,
          fat: 20 * item.quantity,
          protein: 20 * item.quantity,
          carbs: 20 * item.quantity
        }))
      }
    });

  } catch (error) {
    console.error('Get nutrition details error:', error);
    next(error);
  }
};

// Delete meal
const deleteMeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const meal = await Meal.findOneAndDelete({ _id: id, userId });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully'
    });

  } catch (error) {
    console.error('Delete meal error:', error);
    next(error);
  }
};

module.exports = {
  createMeal,
  uploadMealPhoto,
  upload,
  getMeals,
  getMealById,
  getNutritionDetails,
  deleteMeal
};
