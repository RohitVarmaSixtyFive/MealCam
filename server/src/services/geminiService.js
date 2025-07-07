const axios = require('axios');

// This service handles communication with Google Gemini API
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async analyzeImage(imageUrl) {
    try {
      // First, get the image data
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      });
      
      const imageBase64 = Buffer.from(imageResponse.data).toString('base64');
      const imageMimeType = imageResponse.headers['content-type'] || 'image/jpeg';

      // Prepare the prompt for food analysis
      const prompt = `Analyze this food image and provide a detailed nutritional breakdown. 
      Return a JSON object with the following structure:
      {
        "foods": [
          {
            "name": "food item name",
            "quantity": estimated_quantity_number,
            "unit": "g/oz/cup/piece/slice",
            "calories": estimated_calories,
            "protein": estimated_protein_grams,
            "carbs": estimated_carbs_grams,
            "fat": estimated_fat_grams,
            "fiber": estimated_fiber_grams,
            "sugar": estimated_sugar_grams,
            "sodium": estimated_sodium_mg
          }
        ],
        "confidence": "high/medium/low",
        "notes": "any additional observations about the meal"
      }
      
      Be as accurate as possible with portion sizes and nutritional values. 
      If you're unsure about something, indicate lower confidence and mention it in the notes.
      Focus on identifying individual food items rather than describing the overall meal.`;

      // Make request to Gemini API
      const response = await axios.post(
        `${this.baseURL}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: imageMimeType,
                  data: imageBase64
                }
              }
            ]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Parse the response
      const generatedText = response.data.candidates[0].content.parts[0].text;
      
      // Try to extract JSON from the response
      let analysisResult;
      try {
        // Remove any markdown formatting
        const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        analysisResult = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON:', parseError);
        // Fallback: return a structured response with the raw text
        analysisResult = {
          foods: [],
          confidence: 'low',
          notes: 'Failed to parse AI response. Raw response: ' + generatedText,
          rawResponse: generatedText
        };
      }

      return analysisResult;

    } catch (error) {
      console.error('Gemini API error:', error.response?.data || error.message);
      
      // Return a fallback response
      return {
        foods: [],
        confidence: 'low',
        notes: 'Failed to analyze image. Please try again or manually add food items.',
        error: error.message
      };
    }
  }

  async generateNutritionData(foodName, quantity, unit) {
    try {
      const prompt = `Provide nutritional information for ${quantity} ${unit} of ${foodName}.
      Return a JSON object with this exact structure:
      {
        "name": "${foodName}",
        "quantity": ${quantity},
        "unit": "${unit}",
        "calories": estimated_calories_number,
        "protein": estimated_protein_grams,
        "carbs": estimated_carbs_grams,
        "fat": estimated_fat_grams,
        "fiber": estimated_fiber_grams,
        "sugar": estimated_sugar_grams,
        "sodium": estimated_sodium_mg
      }
      
      Be as accurate as possible with the nutritional values.`;

      const response = await axios.post(
        `${this.baseURL}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedText = response.data.candidates[0].content.parts[0].text;
      const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      return JSON.parse(cleanedText);

    } catch (error) {
      console.error('Nutrition generation error:', error);
      
      // Return fallback nutrition data
      return {
        name: foodName,
        quantity: quantity,
        unit: unit,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      };
    }
  }
}

// Export singleton instance
const geminiService = new GeminiService();

module.exports = {
  analyzeImage: (imageUrl) => geminiService.analyzeImage(imageUrl),
  generateNutritionData: (foodName, quantity, unit) => geminiService.generateNutritionData(foodName, quantity, unit)
};
