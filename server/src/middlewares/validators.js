const Joi = require('joi');

const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message
    });
  }
  next();
};

const validateMeal = (req, res, next) => {
  const foodItemSchema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().min(0).required(),
    unit: Joi.string().valid('g', 'kg', 'oz', 'lb', 'cup', 'tbsp', 'tsp', 'ml', 'l', 'piece', 'slice').required(),
    calories: Joi.number().min(0).required(),
    protein: Joi.number().min(0).required(),
    carbs: Joi.number().min(0).required(),
    fat: Joi.number().min(0).required(),
    fiber: Joi.number().min(0).optional(),
    sugar: Joi.number().min(0).optional(),
    sodium: Joi.number().min(0).optional()
  });

  const schema = Joi.object({
    mealTitle: Joi.string().valid('Breakfast', 'Lunch', 'Dinner', 'Snack', 'Other').required(),
    timestamp: Joi.date().optional(),
    foodItems: Joi.array().items(foodItemSchema).min(1).required(),
    notes: Joi.string().max(500).optional(),
    imageUrl: Joi.string().uri().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateMeal
};
