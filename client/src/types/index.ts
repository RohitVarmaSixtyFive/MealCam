import { ReactNode } from 'react';

// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbGoal: number;
  dailyFatGoal: number;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Food and Nutrition types
export interface FoodItem {
  name: string;
  quantity: number;
  unit: FoodUnit;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export type FoodUnit = 'g' | 'kg' | 'oz' | 'lb' | 'cup' | 'tbsp' | 'tsp' | 'ml' | 'l' | 'piece' | 'slice';

// Photo Analysis types
export interface PhotoAnalysisResult {
  mealTitle: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  confidence: number;
}

export interface PhotoUploadResponse {
  success: boolean;
  message: string;
  data: {
    analysis?: PhotoAnalysisResult;
    nutrition?: NutritionTotals;
    imageInfo: {
      filename: string;
      size: number;
      mimetype: string;
    };
    error?: string;
  };
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

// Meal types (updated to match backend)
export interface Meal {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  nutrition: NutritionTotals;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  image?: {
    url?: string;
    publicId?: string;
    originalName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealRequest {
  title: string;
  description?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: Array<{ name: string; quantity: number; unit?: string }>;
  date?: string;
}

// Saved Food types
export interface SavedFood {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  foodItems: FoodItem[];
  totals: NutritionTotals;
  category: SavedFoodCategory;
  imageUrl?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export type SavedFoodCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Pre-workout' | 'Post-workout' | 'Other';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// AI Analysis types
export interface AIAnalysisResult {
  foods: AIDetectedFood[];
  confidence: 'high' | 'medium' | 'low';
  notes: string;
  error?: string;
  rawResponse?: string;
}

export interface AIDetectedFood {
  name: string;
  quantity: number;
  unit: FoodUnit;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Stats and Progress types
export interface DailyStats {
  date: string;
  meals: number;
  totals: NutritionTotals;
  goals: UserPreferences;
}

export interface GoalProgress {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MacroPercentages {
  protein: number;
  carbs: number;
  fat: number;
}

// Form types
export interface MealFormData {
  mealTitle: MealType;
  timestamp: string;
  foodItems: FoodItem[];
  notes?: string;
  imageUrl?: string;
}

export interface FoodItemFormData {
  name: string;
  quantity: string;
  unit: FoodUnit;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber?: string;
  sugar?: string;
  sodium?: string;
}

// Upload types
export interface UploadResponse {
  imageUrl: string;
  analysis: AIAnalysisResult;
  message: string;
}

// Error types
export interface ApiError {
  error: string;
  message: string;
  statusCode?: number;
}

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: ReactNode;
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface WeeklyProgressData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Query types for API calls
export interface MealQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  mealTitle?: MealType;
}

export interface SavedFoodQuery {
  page?: number;
  limit?: number;
  category?: SavedFoodCategory;
  sortBy?: 'usageCount' | 'name' | 'recent';
}
