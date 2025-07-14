const Meal = require('../models/Meal');

// Get daily nutrition summary for a user
const getDailyNutrition = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date = new Date().toISOString().split('T')[0] } = req.query;

    // Set date range for the day
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const meals = await Meal.find({
      userId,
      date: { $gte: startDate, $lt: endDate }
    });

    // Calculate total nutrition for the day
    let totalNutrition = {
      calories: 0,
      fat: 0,
      protein: 0,
      carbs: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    };

    let mealsByType = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    };

    meals.forEach(meal => {
      totalNutrition.calories += meal.nutrition.calories || 0;
      totalNutrition.fat += meal.nutrition.fat || 0;
      totalNutrition.protein += meal.nutrition.protein || 0;
      totalNutrition.carbs += meal.nutrition.carbs || 0;
      totalNutrition.fiber += meal.nutrition.fiber || 0;
      totalNutrition.sugar += meal.nutrition.sugar || 0;
      totalNutrition.sodium += meal.nutrition.sodium || 0;

      mealsByType[meal.mealType].push(meal);
    });

    res.status(200).json({
      success: true,
      data: {
        date,
        totalNutrition,
        mealsByType,
        totalMeals: meals.length
      }
    });

  } catch (error) {
    console.error('Get daily nutrition error:', error);
    next(error);
  }
};

// Get weekly nutrition summary
const getWeeklyNutrition = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate } = req.query;

    let weekStart = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      // If no start date provided, get current week (Monday to Sunday)
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
      weekStart = new Date(weekStart.setDate(diff));
    }

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const meals = await Meal.find({
      userId,
      date: { $gte: weekStart, $lt: weekEnd }
    }).sort({ date: 1 });

    // Group by date and calculate daily totals
    const dailyNutrition = {};
    
    meals.forEach(meal => {
      const dateKey = meal.date.toISOString().split('T')[0];
      
      if (!dailyNutrition[dateKey]) {
        dailyNutrition[dateKey] = {
          calories: 0,
          fat: 0,
          protein: 0,
          carbs: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
          mealCount: 0
        };
      }

      dailyNutrition[dateKey].calories += meal.nutrition.calories || 0;
      dailyNutrition[dateKey].fat += meal.nutrition.fat || 0;
      dailyNutrition[dateKey].protein += meal.nutrition.protein || 0;
      dailyNutrition[dateKey].carbs += meal.nutrition.carbs || 0;
      dailyNutrition[dateKey].fiber += meal.nutrition.fiber || 0;
      dailyNutrition[dateKey].sugar += meal.nutrition.sugar || 0;
      dailyNutrition[dateKey].sodium += meal.nutrition.sodium || 0;
      dailyNutrition[dateKey].mealCount += 1;
    });

    // Calculate weekly averages
    const days = Object.keys(dailyNutrition);
    const weeklyAverage = days.length > 0 ? {
      calories: Math.round(days.reduce((sum, day) => sum + dailyNutrition[day].calories, 0) / days.length),
      fat: Math.round(days.reduce((sum, day) => sum + dailyNutrition[day].fat, 0) / days.length),
      protein: Math.round(days.reduce((sum, day) => sum + dailyNutrition[day].protein, 0) / days.length),
      carbs: Math.round(days.reduce((sum, day) => sum + dailyNutrition[day].carbs, 0) / days.length)
    } : { calories: 0, fat: 0, protein: 0, carbs: 0 };

    res.status(200).json({
      success: true,
      data: {
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        dailyNutrition,
        weeklyAverage,
        totalMeals: meals.length
      }
    });

  } catch (error) {
    console.error('Get weekly nutrition error:', error);
    next(error);
  }
};

module.exports = {
  getDailyNutrition,
  getWeeklyNutrition
};
