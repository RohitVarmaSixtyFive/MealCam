import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus, Camera, Trash2, Edit } from 'lucide-react';
import { mealsApi, nutritionApi } from '@/services/api';
import { Meal, CreateMealRequest, NutritionTotals } from '@/types';
import AddMealModal from '@/components/AddMealModal';
import PhotoUploadModal from '@/components/PhotoUploadModal';

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyNutrition, setDailyNutrition] = useState<NutritionTotals | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState<string>('');

  useEffect(() => {
    fetchMealsAndNutrition();
  }, [selectedDate]);

  const fetchMealsAndNutrition = async () => {
    try {
      setLoading(true);
      const [mealsResponse, nutritionResponse] = await Promise.all([
        mealsApi.getMeals({ date: selectedDate }),
        nutritionApi.getDailyNutrition(selectedDate)
      ]);

      setMeals(mealsResponse.data);
      setDailyNutrition(nutritionResponse.data.totalNutrition);
    } catch (error) {
      console.error('Error fetching meals and nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeal = async (mealData: CreateMealRequest) => {
    try {
      const response = await mealsApi.createMeal({
        title: mealData.title,
        description: mealData.description,
        mealType: mealData.mealType,
        items: mealData.items,
        date: selectedDate
      });

      if (response.success) {
        await fetchMealsAndNutrition();
        setShowAddMealModal(false);
      }
    } catch (error) {
      console.error('Error creating meal:', error);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      const response = await mealsApi.deleteMeal(mealId);
      if (response.success) {
        await fetchMealsAndNutrition();
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const response = await mealsApi.uploadMealPhoto(file);
      if (response.success) {
        console.log('Photo uploaded:', response.data);
        // For now, just show success since we're not saving to DB
        alert('Photo processed successfully! (Not saved to database as requested)');
        setShowPhotoModal(false);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const groupMealsByType = (meals: Meal[]) => {
    return meals.reduce((acc, meal) => {
      if (!acc[meal.mealType]) {
        acc[meal.mealType] = [];
      }
      acc[meal.mealType].push(meal);
      return acc;
    }, {} as Record<string, Meal[]>);
  };

  const mealsByType = groupMealsByType(meals);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading meals...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Meals - BiteMe</title>
        <meta name="description" content="Track and manage your meals" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Meals</h1>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="btn btn-secondary"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Upload Photo
                </button>
                <button
                  onClick={() => setShowAddMealModal(true)}
                  className="btn btn-primary"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Date Selector */}
          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input"
            />
          </div>

          {/* Daily Nutrition Summary */}
          {dailyNutrition && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Daily Nutrition Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dailyNutrition.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dailyNutrition.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{dailyNutrition.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{dailyNutrition.fat}g</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              </div>
            </div>
          )}

          {/* Meals by Type */}
          <div className="space-y-8">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
              <div key={mealType} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold capitalize">{mealType}</h3>
                </div>
                <div className="p-6">
                  {mealsByType[mealType]?.length > 0 ? (
                    <div className="space-y-4">
                      {mealsByType[mealType].map((meal) => (
                        <div key={meal._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{meal.title}</h4>
                              {meal.description && (
                                <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
                              )}
                              <div className="mt-2">
                                <h5 className="text-sm font-medium text-gray-700">Ingredients:</h5>
                                <ul className="text-sm text-gray-600">
                                  {meal.ingredients.map((ingredient, index) => (
                                    <li key={index}>
                                      {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Calories:</span> {meal.nutrition.calories}
                                </div>
                                <div>
                                  <span className="font-medium">Protein:</span> {meal.nutrition.protein}g
                                </div>
                                <div>
                                  <span className="font-medium">Carbs:</span> {meal.nutrition.carbs}g
                                </div>
                                <div>
                                  <span className="font-medium">Fat:</span> {meal.nutrition.fat}g
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteMeal(meal._id)}
                              className="text-red-600 hover:text-red-800 ml-4"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No {mealType} meals for this date
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Modals */}
        {showAddMealModal && (
          <AddMealModal
            onClose={() => setShowAddMealModal(false)}
            onSubmit={handleCreateMeal}
          />
        )}

        {showPhotoModal && (
          <PhotoUploadModal
            onClose={() => setShowPhotoModal(false)}
            onUpload={handlePhotoUpload}
          />
        )}
      </div>
    </>
  );
}
