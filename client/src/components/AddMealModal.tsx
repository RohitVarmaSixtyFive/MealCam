import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { CreateMealRequest } from '@/types';
import { mealsApi } from '@/services/api';

interface AddMealModalProps {
  onClose: () => void;
  onSubmit: (mealData: CreateMealRequest) => Promise<void>;
}

interface MealItem {
  name: string;
  quantity: number;
  unit?: string;
}

export default function AddMealModal({ onClose, onSubmit }: AddMealModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [items, setItems] = useState<MealItem[]>([{ name: '', quantity: 1, unit: 'piece' }]);
  const [nutritionPreview, setNutritionPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, unit: 'piece' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof MealItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const calculateNutrition = async () => {
    const validItems = items.filter(item => item.name.trim() && item.quantity > 0);
    if (validItems.length === 0) return;

    try {
      setLoading(true);
      const response = await mealsApi.calculateNutrition(validItems);
      if (response.success) {
        setNutritionPreview(response.data);
      }
    } catch (error) {
      console.error('Error calculating nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a meal title');
      return;
    }

    const validItems = items.filter(item => item.name.trim() && item.quantity > 0);
    if (validItems.length === 0) {
      alert('Please add at least one item');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        mealType,
        items: validItems
      });
    } catch (error) {
      console.error('Error submitting meal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add New Meal</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Chicken Rice Bowl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type *
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Optional description..."
              />
            </div>

            {/* Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Meal Items *
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Item name (e.g., Chicken breast)"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Qty"
                      />
                    </div>
                    <div className="w-20">
                      <select
                        value={item.unit}
                        onChange={(e) => updateItem(index, 'unit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="piece">piece</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                        <option value="cup">cup</option>
                        <option value="tbsp">tbsp</option>
                        <option value="tsp">tsp</option>
                        <option value="slice">slice</option>
                        <option value="oz">oz</option>
                      </select>
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Preview */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700">Nutrition Preview</h3>
                <button
                  type="button"
                  onClick={calculateNutrition}
                  disabled={loading}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                >
                  {loading ? 'Calculating...' : 'Calculate'}
                </button>
              </div>

              {nutritionPreview && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-blue-600">
                        {nutritionPreview.nutrition.calories}
                      </div>
                      <div className="text-gray-600">Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-600">
                        {nutritionPreview.nutrition.protein}g
                      </div>
                      <div className="text-gray-600">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-yellow-600">
                        {nutritionPreview.nutrition.carbs}g
                      </div>
                      <div className="text-gray-600">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-red-600">
                        {nutritionPreview.nutrition.fat}g
                      </div>
                      <div className="text-gray-600">Fat</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Meal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
