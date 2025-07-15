const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiNutritionService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyASQAbl1RtM7zHPxgzaSdXJ-qzOjdk3CVk';
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
  }

  // Analyze food image and extract meal items with quantities
  async analyzeFoodImage(imageBuffer, mimeType) {
    try {
      const prompt = `
Analyze this food image and identify all the food items with their estimated quantities.

Please provide the response in the following JSON format ONLY (no additional text):

{
  "mealTitle": "<suggested_meal_title>",
  "mealType": "<breakfast|lunch|dinner|snack>",
  "description": "<brief_description_of_the_meal>",
  "items": [
    {
      "name": "<food_item_name>",
      "quantity": <estimated_quantity_number>,
      "unit": "<g|ml|pieces|slices|cups|tbsp>"
    }
  ],
  "confidence": <confidence_score_0_to_1>
}

Guidelines:
- Be as accurate as possible with food identification
- Estimate realistic quantities (consider typical serving sizes)
- Use appropriate units (grams for solids, ml for liquids, pieces for countable items)
- Suggest an appropriate meal type based on the foods and context
- Provide a confidence score based on image clarity and food recognition certainty
- Include all visible food items, even garnishes or sides
`;

      // Convert buffer to base64
      const base64Image = imageBuffer.toString('base64');
      
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      };

      console.log('Sending image to Gemini for food analysis...');
      
      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini image analysis response:', text);
      
      return this.parseFoodAnalysisResponse(text);
      
    } catch (error) {
      console.error('Gemini image analysis error:', error);
      throw new Error('Failed to analyze food image: ' + error.message);
    }
  }

  parseFoodAnalysisResponse(text) {
    try {
      // Clean the response text to extract JSON
      let cleanText = text.trim();
      
      // Remove any markdown formatting
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find JSON content between curly braces
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }
      
      const parsed = JSON.parse(cleanText);
      
      // Validate the structure
      if (!parsed.items || !Array.isArray(parsed.items)) {
        throw new Error('Invalid food analysis structure - missing items array');
      }
      
      // Ensure all required fields are present and valid
      const result = {
        mealTitle: parsed.mealTitle || 'Meal from Photo',
        mealType: this.validateMealType(parsed.mealType),
        description: parsed.description || 'Meal identified from uploaded photo',
        items: parsed.items.map(item => ({
          name: item.name || 'Unknown Food',
          quantity: parseFloat(item.quantity) || 1,
          unit: this.validateUnit(item.unit)
        })),
        confidence: Math.min(Math.max(parseFloat(parsed.confidence) || 0.5, 0), 1)
      };
      
      return result;
      
    } catch (error) {
      console.error('Error parsing food analysis response:', error);
      console.error('Raw response text:', text);
      
      // Return a fallback response
      return {
        mealTitle: 'Meal from Photo',
        mealType: 'lunch',
        description: 'Could not automatically identify foods. Please add items manually.',
        items: [
          {
            name: 'Food Item',
            quantity: 1,
            unit: 'piece'
          }
        ],
        confidence: 0.1
      };
    }
  }

  validateMealType(mealType) {
    const validTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    return validTypes.includes(mealType) ? mealType : 'lunch';
  }

  validateUnit(unit) {
    const validUnits = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'oz'];
    return validUnits.includes(unit) ? unit : 'piece';
  }

  async analyzeNutrition(items) {
    try {
      // Create a detailed prompt for nutrition analysis
      const prompt = this.createNutritionPrompt(items);
      
      console.log('Sending prompt to Gemini:', prompt);
      
      // Generate content using Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini raw response:', text);
      
      // Parse the JSON response
      const nutritionData = this.parseNutritionResponse(text);
      
      return nutritionData;
      
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Fallback to basic calculation
      return this.fallbackNutritionCalculation(items);
    }
  }

  createNutritionPrompt(items) {
    const itemsText = items.map(item => 
      `${item.quantity} ${item.unit || 'pieces'} of ${item.name}`
    ).join(', ');

    return `
You are a nutrition expert. Analyze the following food items and provide detailed nutrition information.

Food items: ${itemsText}

Please provide the nutrition information in the following JSON format ONLY (no additional text):

{
  "calories": <total_calories_number>,
  "fat": <total_fat_grams_number>,
  "protein": <total_protein_grams_number>,
  "carbs": <total_carbs_grams_number>,
  "fiber": <total_fiber_grams_number>,
  "sugar": <total_sugar_grams_number>,
  "sodium": <total_sodium_mg_number>,
  "breakdown": [
    {
      "name": "<food_name>",
      "quantity": <quantity_number>,
      "unit": "<unit>",
      "calories": <calories_for_this_item>,
      "fat": <fat_grams_for_this_item>,
      "protein": <protein_grams_for_this_item>,
      "carbs": <carbs_grams_for_this_item>,
      "fiber": <fiber_grams_for_this_item>,
      "sugar": <sugar_grams_for_this_item>,
      "sodium": <sodium_mg_for_this_item>
    }
  ]
}

Important:
- Use accurate USDA nutrition data
- Round numbers to 1 decimal place
- Ensure all values are numbers, not strings
- Include breakdown for each individual food item
- Return ONLY the JSON, no additional text or explanation
`;
  }

  parseNutritionResponse(text) {
    try {
      // Clean the response text to extract JSON
      let cleanText = text.trim();
      
      // Remove any markdown formatting
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find JSON content between curly braces
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }
      
      // Parse the JSON
      const parsed = JSON.parse(cleanText);
      
      // Validate the structure
      if (!parsed.calories || !parsed.protein || !parsed.carbs || !parsed.fat) {
        throw new Error('Invalid nutrition data structure');
      }
      
      // Ensure all values are numbers and round them
      const result = {
        calories: Math.round(parsed.calories * 10) / 10,
        fat: Math.round(parsed.fat * 10) / 10,
        protein: Math.round(parsed.protein * 10) / 10,
        carbs: Math.round(parsed.carbs * 10) / 10,
        fiber: Math.round((parsed.fiber || 0) * 10) / 10,
        sugar: Math.round((parsed.sugar || 0) * 10) / 10,
        sodium: Math.round((parsed.sodium || 0) * 10) / 10
      };
      
      // Add breakdown if available
      if (parsed.breakdown && Array.isArray(parsed.breakdown)) {
        result.breakdown = parsed.breakdown.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          calories: Math.round(item.calories * 10) / 10,
          fat: Math.round(item.fat * 10) / 10,
          protein: Math.round(item.protein * 10) / 10,
          carbs: Math.round(item.carbs * 10) / 10,
          fiber: Math.round((item.fiber || 0) * 10) / 10,
          sugar: Math.round((item.sugar || 0) * 10) / 10,
          sodium: Math.round((item.sodium || 0) * 10) / 10
        }));
      }
      
      return result;
      
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.error('Raw response text:', text);
      throw new Error('Failed to parse nutrition data from Gemini response');
    }
  }

  fallbackNutritionCalculation(items) {
    console.log('Using fallback nutrition calculation');
    
    // Basic nutrition database for common foods (per 100g or piece)
    const nutritionDB = {
      'apple': { calories: 52, fat: 0.2, protein: 0.3, carbs: 14, fiber: 2.4, sugar: 10, sodium: 1, perUnit: 'piece', unitWeight: 150 },
      'banana': { calories: 89, fat: 0.3, protein: 1.1, carbs: 23, fiber: 2.6, sugar: 12, sodium: 1, perUnit: 'piece', unitWeight: 120 },
      'chicken breast': { calories: 165, fat: 3.6, protein: 31, carbs: 0, fiber: 0, sugar: 0, sodium: 74, perUnit: '100g' },
      'brown rice': { calories: 112, fat: 0.9, protein: 2.6, carbs: 23, fiber: 1.8, sugar: 0.4, sodium: 5, perUnit: '100g' },
      'white rice': { calories: 130, fat: 0.3, protein: 2.7, carbs: 28, fiber: 0.4, sugar: 0.1, sodium: 1, perUnit: '100g' },
      'egg': { calories: 155, fat: 11, protein: 13, carbs: 1.1, fiber: 0, sugar: 1.1, sodium: 124, perUnit: 'piece', unitWeight: 50 },
      'bread': { calories: 265, fat: 3.2, protein: 9, carbs: 49, fiber: 2.7, sugar: 5.4, sodium: 491, perUnit: 'slice', unitWeight: 30 },
      'milk': { calories: 42, fat: 1, protein: 3.4, carbs: 5, fiber: 0, sugar: 5, sodium: 44, perUnit: '100ml' },
      'cheese': { calories: 113, fat: 9, protein: 7, carbs: 1, fiber: 0, sugar: 1, sodium: 215, perUnit: '100g' },
      'tomato': { calories: 18, fat: 0.2, protein: 0.9, carbs: 3.9, fiber: 1.2, sugar: 2.6, sodium: 5, perUnit: 'piece', unitWeight: 100 }
    };
    
    let totalNutrition = {
      calories: 0,
      fat: 0,
      protein: 0,
      carbs: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      breakdown: []
    };

    items.forEach(item => {
      const foodName = item.name.toLowerCase().trim();
      let nutrition = nutritionDB[foodName];
      
      if (!nutrition) {
        // Default nutrition for unknown foods
        nutrition = { calories: 150, fat: 8, protein: 12, carbs: 15, fiber: 4, sugar: 10, sodium: 400, perUnit: '100g' };
      }
      
      let multiplier = 1;
      
      // Calculate multiplier based on quantity and unit
      if (nutrition.perUnit === 'piece' && nutrition.unitWeight) {
        if (item.unit === 'g') {
          multiplier = item.quantity / nutrition.unitWeight;
        } else {
          multiplier = item.quantity; // assuming pieces
        }
      } else if (nutrition.perUnit === '100g') {
        if (item.unit === 'g') {
          multiplier = item.quantity / 100;
        } else {
          multiplier = item.quantity; // assume 100g per unit
        }
      } else if (nutrition.perUnit === '100ml') {
        if (item.unit === 'ml') {
          multiplier = item.quantity / 100;
        } else {
          multiplier = item.quantity; // assume 100ml per unit
        }
      } else {
        multiplier = item.quantity;
      }
      
      const itemNutrition = {
        name: item.name,
        quantity: item.quantity,
        unit: item.unit || 'pieces',
        calories: Math.round(nutrition.calories * multiplier * 10) / 10,
        fat: Math.round(nutrition.fat * multiplier * 10) / 10,
        protein: Math.round(nutrition.protein * multiplier * 10) / 10,
        carbs: Math.round(nutrition.carbs * multiplier * 10) / 10,
        fiber: Math.round(nutrition.fiber * multiplier * 10) / 10,
        sugar: Math.round(nutrition.sugar * multiplier * 10) / 10,
        sodium: Math.round(nutrition.sodium * multiplier * 10) / 10
      };
      
      totalNutrition.breakdown.push(itemNutrition);
      
      totalNutrition.calories += itemNutrition.calories;
      totalNutrition.fat += itemNutrition.fat;
      totalNutrition.protein += itemNutrition.protein;
      totalNutrition.carbs += itemNutrition.carbs;
      totalNutrition.fiber += itemNutrition.fiber;
      totalNutrition.sugar += itemNutrition.sugar;
      totalNutrition.sodium += itemNutrition.sodium;
    });

    // Round total values
    totalNutrition.calories = Math.round(totalNutrition.calories * 10) / 10;
    totalNutrition.fat = Math.round(totalNutrition.fat * 10) / 10;
    totalNutrition.protein = Math.round(totalNutrition.protein * 10) / 10;
    totalNutrition.carbs = Math.round(totalNutrition.carbs * 10) / 10;
    totalNutrition.fiber = Math.round(totalNutrition.fiber * 10) / 10;
    totalNutrition.sugar = Math.round(totalNutrition.sugar * 10) / 10;
    totalNutrition.sodium = Math.round(totalNutrition.sodium * 10) / 10;

    return totalNutrition;
  }
}

module.exports = new GeminiNutritionService();
