// Shared constants across all BiteMe services

export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack'
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  NUTRITIONIST: 'nutritionist'
} as const;

export const NUTRITION_UNITS = {
  GRAMS: 'g',
  KILOGRAMS: 'kg',
  MILLILITERS: 'ml',
  LITERS: 'l',
  CUPS: 'cup',
  TABLESPOONS: 'tbsp',
  TEASPOONS: 'tsp',
  PIECES: 'piece',
  SLICES: 'slice',
  OUNCES: 'oz'
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me'
  },
  MEALS: {
    BASE: '/api/meals',
    UPLOAD: '/api/meals/upload',
    NUTRITION: '/api/meals/nutrition'
  },
  AI: {
    ANALYZE_IMAGE: '/api/ai/analyze-image',
    PARSE_TEXT: '/api/ai/parse-text',
    ESTIMATE_NUTRITION: '/api/ai/estimate-nutrition'
  }
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Access denied. Please log in.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  INVALID_EMAIL: 'Please provide a valid email address',
  WEAK_PASSWORD: 'Password must be at least 8 characters long',
  MEAL_NOT_FOUND: 'Meal not found',
  IMAGE_TOO_LARGE: 'Image file too large. Maximum size is 10MB.',
  INVALID_IMAGE_FORMAT: 'Invalid image format. Supported formats: JPEG, PNG, WebP',
  AI_SERVICE_UNAVAILABLE: 'AI analysis service is temporarily unavailable',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.'
} as const;

export const NUTRITION_GOALS = {
  DEFAULT_CALORIES: 2000,
  DEFAULT_PROTEIN: 150, // grams
  DEFAULT_CARBS: 225, // grams
  DEFAULT_FAT: 65, // grams
  DEFAULT_FIBER: 25, // grams
  DEFAULT_SODIUM: 2300, // mg
  DEFAULT_SUGAR: 50 // grams
} as const;

export const IMAGE_CONSTRAINTS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  MIN_RESOLUTION: { width: 100, height: 100 },
  MAX_RESOLUTION: { width: 4096, height: 4096 }
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
} as const;

export const CACHE_KEYS = {
  USER_PROFILE: 'user:profile',
  DAILY_NUTRITION: 'nutrition:daily',
  RECENT_MEALS: 'meals:recent',
  FOOD_DATABASE: 'food:database'
} as const;

export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400 // 24 hours
} as const;
