// Shared TypeScript types for BiteMe application

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'nutritionist';
  createdAt: Date;
  lastLogin?: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // cm
  weight?: number; // kg
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  dietaryRestrictions?: string[];
  allergies?: string[];
}

export interface Meal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  image?: {
    url: string;
    publicId: string;
    originalName: string;
  };
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: Date;
  nutrition: NutritionInfo;
  ingredients: Ingredient[];
  analysis?: AIAnalysis;
  tags: string[];
  isPublic: boolean;
  likes: number;
  source: 'manual' | 'ai-image' | 'barcode' | 'recipe';
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sugar: number; // grams
  sodium: number; // mg
  saturatedFat?: number; // grams
  unsaturatedFat?: number; // grams
  cholesterol?: number; // mg
  potassium?: number; // mg
  calcium?: number; // mg
  iron?: number; // mg
  vitaminC?: number; // mg
  vitaminA?: number; // IU
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'cup' | 'tbsp' | 'tsp' | 'piece' | 'slice' | 'oz';
  nutrition?: Partial<NutritionInfo>;
}

export interface AIAnalysis {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  confidence?: number; // 0-1
  recognizedFoods: RecognizedFood[];
  processedAt?: Date;
  errorMessage?: string;
  suggestions?: string[];
}

export interface RecognizedFood {
  name: string;
  confidence: number; // 0-1
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  nutrition?: Partial<NutritionInfo>;
  portionSize?: string;
}

export interface DailyNutritionSummary {
  date: Date;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  mealCount: number;
  mealsByType: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
  goalsProgress: {
    calories: number; // percentage
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface WeeklyNutritionTrend {
  weekStart: Date;
  dailySummaries: DailyNutritionSummary[];
  averages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  trends: {
    calories: 'increasing' | 'decreasing' | 'stable';
    weight?: 'increasing' | 'decreasing' | 'stable';
  };
}

export interface FoodDatabaseItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  nutrition: NutritionInfo;
  servingSize: {
    amount: number;
    unit: string;
    description: string;
  };
  barcode?: string;
  verified: boolean;
  source: 'usda' | 'user' | 'brand';
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: ValidationError[];
  pagination?: PaginationInfo;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface CreateMealRequest {
  title: string;
  description?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date?: Date;
  ingredients?: Ingredient[];
  nutrition?: Partial<NutritionInfo>;
  tags?: string[];
  isPublic?: boolean;
}

export interface ImageAnalysisRequest {
  image: File | string; // File object or base64 string
  options?: {
    includeNutrition: boolean;
    confidenceThreshold: number;
    maxResults: number;
  };
}

export interface ImageAnalysisResponse {
  foods: RecognizedFood[];
  overallConfidence: number;
  processingTime: number;
  recommendations?: string[];
  estimatedNutrition?: NutritionInfo;
}

// Service-specific types
export interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  service: string;
  timestamp: Date;
  uptime?: number;
  version?: string;
  dependencies?: {
    [key: string]: 'healthy' | 'unhealthy';
  };
}

export interface ServiceRegistration {
  name: string;
  url: string;
  version: string;
  health: {
    endpoint: string;
    interval: number;
  };
}

// Error types
export interface ServiceError extends Error {
  statusCode: number;
  service?: string;
  requestId?: string;
  timestamp: Date;
}

export interface RateLimitError extends ServiceError {
  retryAfter: number;
  limit: number;
  remaining: number;
}

// Configuration types
export interface DatabaseConfig {
  uri: string;
  options: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
    maxPoolSize?: number;
    minPoolSize?: number;
  };
}

export interface RedisConfig {
  url: string;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder?: string;
}
