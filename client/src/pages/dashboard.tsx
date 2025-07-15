import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Plus, TrendingUp, Target, Calendar, UtensilsCrossed } from 'lucide-react';
import { authApi, nutritionApi } from '@/services/api';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);

  const [goals, setGoals] = useState({
    dailyCalorieGoal: 2000,
    dailyProteinGoal: 150,
    dailyCarbGoal: 200,
    dailyFatGoal: 67
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [userResponse, dailyResponse, weeklyResponse] = await Promise.all([
        authApi.getMe(),
        nutritionApi.getDailyNutrition(),
        nutritionApi.getWeeklyNutrition()
      ]);

      setDailyStats(dailyResponse.data);
      setWeeklyStats(weeklyResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  // Calculate progress percentages
  const progressPercentage = dailyStats ? {
    calories: Math.round((dailyStats.totalNutrition.calories / goals.dailyCalorieGoal) * 100),
    protein: Math.round((dailyStats.totalNutrition.protein / goals.dailyProteinGoal) * 100),
    carbs: Math.round((dailyStats.totalNutrition.carbs / goals.dailyCarbGoal) * 100),
    fat: Math.round((dailyStats.totalNutrition.fat / goals.dailyFatGoal) * 100)
  } : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  // Redirect guard: show loading while checking token
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <ProtectedLayout>
      <Head>
        <title>Dashboard - BiteMe</title>
        <meta name="description" content="Your nutrition tracking dashboard" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's your nutrition overview for today.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/meals" className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow transition-colors">
            <div className="flex items-center">
              <Plus className="w-8 h-8 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">Add Meal</h3>
                <p className="text-blue-100">Log your latest meal</p>
              </div>
            </div>
          </Link>
          
          <Link href="/meals" className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow transition-colors">
            <div className="flex items-center">
              <UtensilsCrossed className="w-8 h-8 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">View Meals</h3>
                <p className="text-green-100">See all your meals</p>
              </div>
            </div>
          </Link>
          
          <Link href="/progress" className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg shadow transition-colors">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">View Progress</h3>
                <p className="text-purple-100">Track your trends</p>
              </div>
            </div>
          </Link>
        </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dailyStats?.totalNutrition?.calories || 0}
              </div>
              <div className="text-sm text-gray-600">
                / {goals.dailyCalorieGoal} cal
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(progressPercentage.calories, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Calories</div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {dailyStats?.totalNutrition?.protein || 0}g
              </div>
              <div className="text-sm text-gray-600">
                / {goals.dailyProteinGoal}g
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min(progressPercentage.protein, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Protein</div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {dailyStats?.totalNutrition?.carbs || 0}g
              </div>
              <div className="text-sm text-gray-600">
                / {goals.dailyCarbGoal}g
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{ width: `${Math.min(progressPercentage.carbs, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Carbs</div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-red-600">
                {dailyStats?.totalNutrition?.fat || 0}g
              </div>
              <div className="text-sm text-gray-600">
                / {goals.dailyFatGoal}g
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${Math.min(progressPercentage.fat, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Fat</div>
            </div>
          </div>

          {/* Recent Meals Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Meals</h3>
            {dailyStats?.totalMeals > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  You've logged {dailyStats.totalMeals} meal{dailyStats.totalMeals !== 1 ? 's' : ''} today.
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(dailyStats.mealsByType || {}).map(([type, meals]) => (
                    <div key={type} className="text-center">
                      <div className="text-lg font-medium text-gray-900 capitalize">{type}</div>
                      <div className="text-sm text-gray-500">{Array.isArray(meals) ? meals.length : 0} meal{(Array.isArray(meals) ? meals.length : 0) !== 1 ? 's' : ''}</div>
                    </div>
                  ))}
                </div>
                <Link href="/meals" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all meals →
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">No meals logged today</div>
                <Link href="/meals" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Meal
                </Link>
              </div>
            )}
          </div>
        </div>
      </ProtectedLayout>
    );
  }
