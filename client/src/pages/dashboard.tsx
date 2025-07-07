import { useState } from 'react';
import Head from 'next/head';
import { Camera, Plus, TrendingUp, Target, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [dailyStats] = useState({
    date: new Date().toISOString().split('T')[0],
    meals: 3,
    totals: {
      calories: 1450,
      protein: 98,
      carbs: 165,
      fat: 48
    },
    goals: {
      dailyCalorieGoal: 2000,
      dailyProteinGoal: 150,
      dailyCarbGoal: 200,
      dailyFatGoal: 67
    }
  });

  const progressPercentage = {
    calories: Math.round((dailyStats.totals.calories / dailyStats.goals.dailyCalorieGoal) * 100),
    protein: Math.round((dailyStats.totals.protein / dailyStats.goals.dailyProteinGoal) * 100),
    carbs: Math.round((dailyStats.totals.carbs / dailyStats.goals.dailyCarbGoal) * 100),
    fat: Math.round((dailyStats.totals.fat / dailyStats.goals.dailyFatGoal) * 100)
  };

  return (
    <>
      <Head>
        <title>Dashboard - BiteMe</title>
        <meta name="description" content="Your nutrition tracking dashboard" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
              <button className="btn btn-primary">
                <Plus className="w-5 h-5 mr-2" />
                Add Meal
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary-600">
                {dailyStats.totals.calories}
              </div>
              <div className="text-sm text-gray-600">
                / {dailyStats.goals.dailyCalorieGoal} cal
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${Math.min(progressPercentage.calories, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Calories</div>
            </div>

            <div className="card text-center">
              <div className="text-2xl font-bold text-secondary-600">
                {dailyStats.totals.protein}g
              </div>
              <div className="text-sm text-gray-600">
                / {dailyStats.goals.dailyProteinGoal}g
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-secondary-600 h-2 rounded-full"
                    style={{ width: `${Math.min(progressPercentage.protein, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Protein</div>
            </div>

            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dailyStats.totals.carbs}g
              </div>
              <div className="text-sm text-gray-600">
                / {dailyStats.goals.dailyCarbGoal}g
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(progressPercentage.carbs, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Carbs</div>
            </div>

            <div className="card text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {dailyStats.totals.fat}g
              </div>
              <div className="text-sm text-gray-600">
                / {dailyStats.goals.dailyFatGoal}g
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{ width: `${Math.min(progressPercentage.fat, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Fat</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card card-hover cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <Camera className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Upload Meal Photo</h3>
                  <p className="text-sm text-gray-600">AI-powered meal recognition</p>
                </div>
              </div>
            </div>

            <div className="card card-hover cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-4">
                  <Plus className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manual Entry</h3>
                  <p className="text-sm text-gray-600">Add meals manually</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Meals */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Meals</h3>
            <div className="space-y-4">
              {/* Placeholder meal entries */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium">Lunch</div>
                    <div className="text-sm text-gray-600">Grilled chicken, rice, vegetables</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">650 cal</div>
                  <div className="text-sm text-gray-600">45g protein</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <div className="font-medium">Breakfast</div>
                    <div className="text-sm text-gray-600">Oatmeal with berries and protein powder</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">400 cal</div>
                  <div className="text-sm text-gray-600">30g protein</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Snack</div>
                    <div className="text-sm text-gray-600">Greek yogurt with nuts</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">200 cal</div>
                  <div className="text-sm text-gray-600">15g protein</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
