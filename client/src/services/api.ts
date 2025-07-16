import axios, { AxiosResponse } from 'axios';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  User,
  ApiResponse,
  Meal,
  CreateMealRequest,
  NutritionTotals,
  PhotoUploadResponse
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const MEALS_API_URL = process.env.NEXT_PUBLIC_MEALS_API_URL || 'http://localhost:3002/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', credentials);
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response: AxiosResponse<{ user: User }> = await api.get('/auth/me');
    console.log('User data:', response.data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

// Meals API calls
export const mealsApi = {
  // Create a meal with multiple items
  createMeal: async (mealData: {
    title: string;
    description?: string;
    mealType: string;
    items: Array<{ name: string; quantity: number; unit?: string }>;
    date?: string;
  }): Promise<{ success: boolean; data: Meal; message: string }> => {
    const response = await api.post(`${MEALS_API_URL}/meals`, mealData);
    return response.data;
  },

  // Get user's meals
  getMeals: async (params?: {
    page?: number;
    limit?: number;
    mealType?: string;
    date?: string;
  }): Promise<{
    success: boolean;
    data: Meal[];
    pagination: { current: number; pages: number; total: number };
  }> => {
    const response = await api.get(`${MEALS_API_URL}/meals`, { params });
    return response.data;
  },

  // Get specific meal by ID
  getMealById: async (id: string): Promise<{ success: boolean; data: Meal }> => {
    const response = await api.get(`${MEALS_API_URL}/meals/${id}`);
    return response.data;
  },

  // Upload meal photo and analyze with AI
  uploadMealPhoto: async (imageFile: File): Promise<PhotoUploadResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`${MEALS_API_URL}/meals/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Calculate nutrition for items
  calculateNutrition: async (items: Array<{ name: string; quantity: number }>): Promise<{
    success: boolean;
    data: {
      items: Array<{ name: string; quantity: number }>;
      nutrition: NutritionTotals;
      breakdown: Array<{
        name: string;
        quantity: number;
        calories: number;
        fat: number;
        protein: number;
        carbs: number;
      }>;
    };
    message: string;
  }> => {
    const response = await api.post(`${MEALS_API_URL}/meals/nutrition`, { items });
    return response.data;
  },

  // Delete meal
  deleteMeal: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`${MEALS_API_URL}/meals/${id}`);
    return response.data;
  },
};

// Nutrition API calls
export const nutritionApi = {
  // Get daily nutrition summary
  getDailyNutrition: async (date?: string): Promise<{
    success: boolean;
    data: {
      date: string;
      totalNutrition: NutritionTotals;
      mealsByType: {
        breakfast: Meal[];
        lunch: Meal[];
        dinner: Meal[];
        snack: Meal[];
      };
      totalMeals: number;
    };
  }> => {
    const params = date ? { date } : {};
    const response = await api.get(`${MEALS_API_URL}/nutrition/daily`, { params });
    return response.data;
  },

  // Get weekly nutrition summary
  getWeeklyNutrition: async (startDate?: string): Promise<{
    success: boolean;
    data: {
      weekStart: string;
      weekEnd: string;
      dailyNutrition: Record<string, NutritionTotals & { mealCount: number }>;
      weeklyAverage: NutritionTotals;
      totalMeals: number;
    };
  }> => {
    const params = startDate ? { startDate } : {};
    const response = await api.get(`${MEALS_API_URL}/nutrition/weekly`, { params });
    return response.data;
  },
};
