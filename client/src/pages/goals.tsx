import { useState } from 'react';
import Head from 'next/head';
import { Target, Save, TrendingUp } from 'lucide-react';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function GoalsPage() {
  const [goals, setGoals] = useState({
    dailyCalorieGoal: 2000,
    dailyProteinGoal: 150,
    dailyCarbGoal: 200,
    dailyFatGoal: 67,
    weeklyWeightGoal: 0.5,
    activityLevel: 'moderate'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving goals:', goals);
    setIsEditing(false);
    // Add success toast notification here
  };

  const handleInputChange = (field: string, value: number | string) => {
    setGoals(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <ProtectedLayout>
      <Head>
        <title>Goals - BiteMe</title>
        <meta name="description" content="Set and manage your nutrition goals" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutrition Goals</h1>
            <p className="text-gray-600">Set your daily nutrition targets to track your progress.</p>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Goals
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Target className="w-4 h-4 mr-2" />
                Edit Goals
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Daily Nutrition Goals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Nutrition Targets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Calories
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={goals.dailyCalorieGoal}
                    onChange={(e) => handleInputChange('dailyCalorieGoal', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-2xl font-bold text-blue-600">{goals.dailyCalorieGoal} cal</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Protein
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={goals.dailyProteinGoal}
                    onChange={(e) => handleInputChange('dailyProteinGoal', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-2xl font-bold text-green-600">{goals.dailyProteinGoal}g</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Carbohydrates
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={goals.dailyCarbGoal}
                    onChange={(e) => handleInputChange('dailyCarbGoal', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-2xl font-bold text-yellow-600">{goals.dailyCarbGoal}g</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Fat
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={goals.dailyFatGoal}
                    onChange={(e) => handleInputChange('dailyFatGoal', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-2xl font-bold text-red-600">{goals.dailyFatGoal}g</div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Level</h2>
            {isEditing ? (
              <select
                value={goals.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (light exercise/sports 1-3 days/week)</option>
                <option value="moderate">Moderate (moderate exercise/sports 3-5 days/week)</option>
                <option value="active">Active (hard exercise/sports 6-7 days a week)</option>
                <option value="very-active">Very Active (very hard exercise/sports & physical job)</option>
              </select>
            ) : (
              <div className="text-lg capitalize text-gray-700">{goals.activityLevel.replace('-', ' ')}</div>
            )}
          </div>

          {/* Weight Goals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weight Goals</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Weight Change Goal (lbs)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.1"
                  value={goals.weeklyWeightGoal}
                  onChange={(e) => handleInputChange('weeklyWeightGoal', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-lg text-gray-700">
                  {goals.weeklyWeightGoal > 0 ? '+' : ''}{goals.weeklyWeightGoal} lbs per week
                  {goals.weeklyWeightGoal === 0 && ' (Maintain weight)'}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Positive values for weight gain, negative for weight loss, zero to maintain
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-start">
              <TrendingUp className="w-6 h-6 text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">Tips for Setting Goals</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Set realistic and achievable targets based on your lifestyle</li>
                  <li>• Consult with a healthcare professional for personalized advice</li>
                  <li>• Adjust goals gradually as you progress in your fitness journey</li>
                  <li>• Remember that consistency is more important than perfection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
