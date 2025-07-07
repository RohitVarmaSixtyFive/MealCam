const mongoose = require('mongoose');

const savedFoodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Saved food name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  foodItems: [{
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
  }],
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
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-workout', 'Post-workout', 'Other'],
    default: 'Other'
  },
  imageUrl: {
    type: String,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0,
    min: [0, 'Usage count cannot be negative']
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
savedFoodSchema.pre('save', function(next) {
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
savedFoodSchema.index({ userId: 1, name: 1 });
savedFoodSchema.index({ userId: 1, usageCount: -1 });

module.exports = mongoose.model('SavedFood', savedFoodSchema);
