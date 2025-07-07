/**
 * Utility functions for calorie and nutrition calculations
 */

/**
 * Calculate total nutrition from an array of food items
 * @param {Array} foodItems - Array of food items with nutrition data
 * @returns {Object} - Total nutrition values
 */
function calculateTotalNutrition(foodItems) {
  return foodItems.reduce((totals, item) => {
    return {
      calories: totals.calories + (item.calories || 0),
      protein: totals.protein + (item.protein || 0),
      carbs: totals.carbs + (item.carbs || 0),
      fat: totals.fat + (item.fat || 0),
      fiber: totals.fiber + (item.fiber || 0),
      sugar: totals.sugar + (item.sugar || 0),
      sodium: totals.sodium + (item.sodium || 0)
    };
  }, {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });
}

/**
 * Calculate percentage of daily goals met
 * @param {Object} totals - Current nutrition totals
 * @param {Object} goals - Daily nutrition goals
 * @returns {Object} - Percentage of goals met
 */
function calculateGoalProgress(totals, goals) {
  return {
    calories: goals.dailyCalorieGoal ? Math.round((totals.calories / goals.dailyCalorieGoal) * 100) : 0,
    protein: goals.dailyProteinGoal ? Math.round((totals.protein / goals.dailyProteinGoal) * 100) : 0,
    carbs: goals.dailyCarbGoal ? Math.round((totals.carbs / goals.dailyCarbGoal) * 100) : 0,
    fat: goals.dailyFatGoal ? Math.round((totals.fat / goals.dailyFatGoal) * 100) : 0
  };
}

/**
 * Calculate calories from macronutrients
 * @param {number} protein - Protein in grams
 * @param {number} carbs - Carbohydrates in grams
 * @param {number} fat - Fat in grams
 * @returns {number} - Total calories
 */
function calculateCaloriesFromMacros(protein, carbs, fat) {
  return (protein * 4) + (carbs * 4) + (fat * 9);
}

/**
 * Calculate macronutrient percentages
 * @param {number} protein - Protein in grams
 * @param {number} carbs - Carbohydrates in grams
 * @param {number} fat - Fat in grams
 * @returns {Object} - Macronutrient percentages
 */
function calculateMacroPercentages(protein, carbs, fat) {
  const totalCalories = calculateCaloriesFromMacros(protein, carbs, fat);
  
  if (totalCalories === 0) {
    return { protein: 0, carbs: 0, fat: 0 };
  }
  
  return {
    protein: Math.round(((protein * 4) / totalCalories) * 100),
    carbs: Math.round(((carbs * 4) / totalCalories) * 100),
    fat: Math.round(((fat * 9) / totalCalories) * 100)
  };
}

/**
 * Validate nutrition data
 * @param {Object} nutritionData - Nutrition data to validate
 * @returns {Object} - Validation result
 */
function validateNutritionData(nutritionData) {
  const errors = [];
  
  // Check required fields
  const requiredFields = ['calories', 'protein', 'carbs', 'fat'];
  requiredFields.forEach(field => {
    if (nutritionData[field] === undefined || nutritionData[field] === null) {
      errors.push(`${field} is required`);
    } else if (typeof nutritionData[field] !== 'number') {
      errors.push(`${field} must be a number`);
    } else if (nutritionData[field] < 0) {
      errors.push(`${field} cannot be negative`);
    }
  });
  
  // Check optional fields
  const optionalFields = ['fiber', 'sugar', 'sodium'];
  optionalFields.forEach(field => {
    if (nutritionData[field] !== undefined && nutritionData[field] !== null) {
      if (typeof nutritionData[field] !== 'number') {
        errors.push(`${field} must be a number`);
      } else if (nutritionData[field] < 0) {
        errors.push(`${field} cannot be negative`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Round nutrition values to reasonable precision
 * @param {Object} nutrition - Nutrition object
 * @returns {Object} - Rounded nutrition values
 */
function roundNutritionValues(nutrition) {
  return {
    calories: Math.round(nutrition.calories),
    protein: Math.round(nutrition.protein * 10) / 10, // 1 decimal place
    carbs: Math.round(nutrition.carbs * 10) / 10,
    fat: Math.round(nutrition.fat * 10) / 10,
    fiber: Math.round((nutrition.fiber || 0) * 10) / 10,
    sugar: Math.round((nutrition.sugar || 0) * 10) / 10,
    sodium: Math.round(nutrition.sodium || 0) // Whole numbers for sodium (mg)
  };
}

/**
 * Get nutrition density score (nutrition per calorie)
 * @param {Object} nutrition - Nutrition data
 * @returns {number} - Nutrition density score
 */
function getNutritionDensityScore(nutrition) {
  if (!nutrition.calories || nutrition.calories === 0) return 0;
  
  // Simple scoring based on protein and fiber content relative to calories
  const proteinScore = (nutrition.protein || 0) / nutrition.calories * 100;
  const fiberScore = (nutrition.fiber || 0) / nutrition.calories * 100;
  
  return Math.round((proteinScore + fiberScore) * 10) / 10;
}

module.exports = {
  calculateTotalNutrition,
  calculateGoalProgress,
  calculateCaloriesFromMacros,
  calculateMacroPercentages,
  validateNutritionData,
  roundNutritionValues,
  getNutritionDensityScore
};
