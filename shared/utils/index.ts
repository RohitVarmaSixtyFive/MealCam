// Shared utility functions for BiteMe services

import { NutritionInfo, ValidationError } from '../types';

/**
 * JWT Token utilities
 */
export const tokenUtils = {
  // Extract user ID from JWT payload
  extractUserId: (token: string): string | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub;
    } catch {
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  },

  // Get token expiration time
  getTokenExpiration: (token: string): Date | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }
};

/**
 * Validation utilities
 */
export const validation = {
  // Email validation
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password strength validation
  isStrongPassword: (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  },

  // Image file validation
  isValidImageFile: (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: 'File too large. Maximum size is 10MB.' };
    }

    return { isValid: true };
  },

  // Nutrition data validation
  isValidNutrition: (nutrition: Partial<NutritionInfo>): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (nutrition.calories !== undefined && (nutrition.calories < 0 || nutrition.calories > 5000)) {
      errors.push({ field: 'calories', message: 'Calories must be between 0 and 5000' });
    }

    if (nutrition.protein !== undefined && (nutrition.protein < 0 || nutrition.protein > 200)) {
      errors.push({ field: 'protein', message: 'Protein must be between 0 and 200g' });
    }

    if (nutrition.carbs !== undefined && (nutrition.carbs < 0 || nutrition.carbs > 500)) {
      errors.push({ field: 'carbs', message: 'Carbs must be between 0 and 500g' });
    }

    if (nutrition.fat !== undefined && (nutrition.fat < 0 || nutrition.fat > 200)) {
      errors.push({ field: 'fat', message: 'Fat must be between 0 and 200g' });
    }

    return errors;
  }
};

/**
 * Date utilities
 */
export const dateUtils = {
  // Get start of day
  getStartOfDay: (date: Date): Date => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  },

  // Get end of day
  getEndOfDay: (date: Date): Date => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  },

  // Get start of week (Monday)
  getStartOfWeek: (date: Date): Date => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  },

  // Get date range for the past N days
  getPastDays: (days: number, endDate: Date = new Date()): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      dates.push(dateUtils.getStartOfDay(date));
    }
    return dates.reverse();
  },

  // Format date for API
  formatForAPI: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  // Parse API date string
  parseFromAPI: (dateString: string): Date => {
    return new Date(dateString);
  }
};

/**
 * Nutrition calculation utilities
 */
export const nutritionUtils = {
  // Calculate total calories from macros
  calculateCaloriesFromMacros: (protein: number, carbs: number, fat: number): number => {
    return (protein * 4) + (carbs * 4) + (fat * 9);
  },

  // Calculate macro percentages
  calculateMacroPercentages: (nutrition: NutritionInfo) => {
    const totalCalories = nutrition.calories || nutritionUtils.calculateCaloriesFromMacros(
      nutrition.protein, nutrition.carbs, nutrition.fat
    );

    if (totalCalories === 0) return { protein: 0, carbs: 0, fat: 0 };

    return {
      protein: Math.round((nutrition.protein * 4 / totalCalories) * 100),
      carbs: Math.round((nutrition.carbs * 4 / totalCalories) * 100),
      fat: Math.round((nutrition.fat * 9 / totalCalories) * 100)
    };
  },

  // Scale nutrition values by portion
  scaleNutrition: (nutrition: NutritionInfo, scale: number): NutritionInfo => {
    return {
      calories: Math.round(nutrition.calories * scale),
      protein: Math.round(nutrition.protein * scale * 10) / 10,
      carbs: Math.round(nutrition.carbs * scale * 10) / 10,
      fat: Math.round(nutrition.fat * scale * 10) / 10,
      fiber: Math.round((nutrition.fiber || 0) * scale * 10) / 10,
      sugar: Math.round((nutrition.sugar || 0) * scale * 10) / 10,
      sodium: Math.round((nutrition.sodium || 0) * scale)
    };
  },

  // Aggregate nutrition from multiple sources
  aggregateNutrition: (nutritionArray: NutritionInfo[]): NutritionInfo => {
    return nutritionArray.reduce((total, current) => ({
      calories: total.calories + current.calories,
      protein: total.protein + current.protein,
      carbs: total.carbs + current.carbs,
      fat: total.fat + current.fat,
      fiber: (total.fiber || 0) + (current.fiber || 0),
      sugar: (total.sugar || 0) + (current.sugar || 0),
      sodium: (total.sodium || 0) + (current.sodium || 0)
    }), {
      calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0
    });
  }
};

/**
 * Error handling utilities
 */
export const errorUtils = {
  // Create standardized error response
  createErrorResponse: (message: string, statusCode: number = 500, errors?: ValidationError[]) => ({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  }),

  // Extract error message from various error types
  extractErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.error) return error.error;
    return 'An unexpected error occurred';
  },

  // Check if error is operational (safe to expose to client)
  isOperationalError: (error: any): boolean => {
    return error.isOperational === true || 
           error.statusCode < 500 ||
           ['ValidationError', 'CastError'].includes(error.name);
  }
};

/**
 * Formatting utilities
 */
export const formatUtils = {
  // Format numbers with proper decimal places
  formatNumber: (num: number, decimals: number = 1): string => {
    return Number(num).toFixed(decimals);
  },

  // Format nutrition value with unit
  formatNutrition: (value: number, unit: string): string => {
    return `${formatUtils.formatNumber(value)}${unit}`;
  },

  // Format calories
  formatCalories: (calories: number): string => {
    return `${Math.round(calories)} cal`;
  },

  // Capitalize first letter
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Convert camelCase to human readable
  camelToHuman: (str: string): string => {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
};

/**
 * Image processing utilities
 */
export const imageUtils = {
  // Convert File to base64
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Compress image (placeholder - would need actual implementation)
  compressImage: async (file: File, quality: number = 0.8): Promise<File> => {
    // This would require a canvas-based compression implementation
    // For now, return the original file
    return file;
  },

  // Generate thumbnail URL
  generateThumbnailUrl: (originalUrl: string, width: number = 200): string => {
    // Cloudinary URL transformation example
    if (originalUrl.includes('cloudinary.com')) {
      return originalUrl.replace('/upload/', `/upload/w_${width},c_thumb/`);
    }
    return originalUrl;
  }
};

/**
 * Pagination utilities
 */
export const paginationUtils = {
  // Calculate pagination info
  calculatePagination: (page: number, limit: number, total: number) => {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev
    };
  },

  // Get offset for database queries
  getOffset: (page: number, limit: number): number => {
    return (page - 1) * limit;
  }
};

/**
 * Cache utilities
 */
export const cacheUtils = {
  // Generate cache key
  generateKey: (prefix: string, ...parts: (string | number)[]): string => {
    return `${prefix}:${parts.join(':')}`;
  },

  // Calculate TTL in seconds
  getTTL: (minutes: number): number => {
    return minutes * 60;
  }
};
