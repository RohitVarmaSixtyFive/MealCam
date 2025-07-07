const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food item name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['g', 'kg', 'oz', 'lb', 'cup', 'tbsp', 'tsp', 'ml', 'l', 'piece', 'slice']
  },
  calories: {
    type: Number,
    required: [true, 'Calories are required'],
    min: [0, 'Calories cannot be negative']
  },
  protein: {
    type: Number,
    required: [true, 'Protein is required'],
    min: [0, 'Protein cannot be negative']
  },
  carbs: {
    type: Number,
    required: [true, 'Carbs are required'],
    min: [0, 'Carbs cannot be negative']
  },
  fat: {
    type: Number,
    required: [true, 'Fat is required'],
    min: [0, 'Fat cannot be negative']
  },
  fiber: {
    type: Number,
    default: 0,
    min: [0, 'Fiber cannot be negative']
  },
  sugar: {
    type: Number,
    default: 0,
    min: [0, 'Sugar cannot be negative']
  },
  sodium: {
    type: Number,
    default: 0,
    min: [0, 'Sodium cannot be negative']
  }
});

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  mealTitle: {
    type: String,
    required: [true, 'Meal title is required'],
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Other']
  },
  timestamp: {
    type: Date,
    required: [true, 'Timestamp is required'],
    default: Date.now
  },
  foodItems: [foodItemSchema],
  totals: {
    calories: {
      type: Number,
      required: true,
      min: [0, 'Total calories cannot be negative']
    },
    protein: {
      type: Number,
      required: true,
      min: [0, 'Total protein cannot be negative']
    },
    carbs: {
      type: Number,
      required: true,
      min: [0, 'Total carbs cannot be negative']
    },
    fat: {
      type: Number,
      required: true,
      min: [0, 'Total fat cannot be negative']
    },
    fiber: {
      type: Number,
      default: 0,
      min: [0, 'Total fiber cannot be negative']
    },
    sugar: {
      type: Number,
      default: 0,
      min: [0, 'Total sugar cannot be negative']
    },
    sodium: {
      type: Number,
      default: 0,
      min: [0, 'Total sodium cannot be negative']
    }
  },
  imageUrl: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate totals before saving
mealSchema.pre('save', function(next) {
  const totals = this.foodItems.reduce((acc, item) => {
    acc.calories += item.calories;
    acc.protein += item.protein;
    acc.carbs += item.carbs;
    acc.fat += item.fat;
    acc.fiber += item.fiber;
    acc.sugar += item.sugar;
    acc.sodium += item.sodium;
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
  
  this.totals = totals;
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
mealSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Meal', mealSchema);
