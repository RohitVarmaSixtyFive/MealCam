const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  image: {
    url: String,
    publicId: String, // Cloudinary public ID
    originalName: String
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  nutrition: {
    calories: {
      type: Number,
      min: 0,
      default: 0
    },
    protein: {
      type: Number,
      min: 0,
      default: 0
    },
    carbs: {
      type: Number,
      min: 0,
      default: 0
    },
    fat: {
      type: Number,
      min: 0,
      default: 0
    },
    fiber: {
      type: Number,
      min: 0,
      default: 0
    },
    sugar: {
      type: Number,
      min: 0,
      default: 0
    },
    sodium: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'oz'],
      default: 'g'
    }
  }],
  analysis: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1
    },
    recognizedFoods: [{
      name: String,
      confidence: Number,
      nutrition: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number
      }
    }],
    processedAt: Date,
    errorMessage: String
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  source: {
    type: String,
    enum: ['manual', 'ai-image', 'barcode', 'recipe'],
    default: 'manual'
  }
}, {
  timestamps: true
});

// Indexes for performance
mealSchema.index({ userId: 1, date: -1 });
mealSchema.index({ mealType: 1, date: -1 });
mealSchema.index({ 'analysis.status': 1 });
mealSchema.index({ tags: 1 });

// Virtual for total daily calories calculation
mealSchema.virtual('dailyTotalCalories').get(function() {
  return this.nutrition.calories;
});

// Method to calculate nutrition totals
mealSchema.methods.calculateNutritionTotals = function() {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };

  this.ingredients.forEach(ingredient => {
    // This would typically involve looking up nutrition data
    // For now, we use the stored nutrition values
  });

  return totals;
};

// Static method to get daily nutrition summary
mealSchema.statics.getDailyNutrition = async function(userId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const meals = await this.find({
    userId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });

  const summary = {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalFiber: 0,
    totalSugar: 0,
    totalSodium: 0,
    mealCount: meals.length,
    mealsByType: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0
    }
  };

  meals.forEach(meal => {
    summary.totalCalories += meal.nutrition.calories || 0;
    summary.totalProtein += meal.nutrition.protein || 0;
    summary.totalCarbs += meal.nutrition.carbs || 0;
    summary.totalFat += meal.nutrition.fat || 0;
    summary.totalFiber += meal.nutrition.fiber || 0;
    summary.totalSugar += meal.nutrition.sugar || 0;
    summary.totalSodium += meal.nutrition.sodium || 0;
    summary.mealsByType[meal.mealType]++;
  });

  return summary;
};

module.exports = mongoose.model('Meal', mealSchema);
