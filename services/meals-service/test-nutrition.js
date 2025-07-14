// Test script for Gemini Nutrition Service
require('dotenv').config();
const geminiNutritionService = require('./src/services/geminiNutritionService');

async function testNutritionAnalysis() {
  console.log('Testing Gemini Nutrition Service...');
  
  const testItems = [
    { name: 'apple', quantity: 2, unit: 'pieces' },
    { name: 'chicken breast', quantity: 150, unit: 'g' },
    { name: 'brown rice', quantity: 100, unit: 'g' }
  ];

  try {
    console.log('Analyzing items:', testItems);
    const result = await geminiNutritionService.analyzeNutrition(testItems);
    console.log('Nutrition analysis result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testNutritionAnalysis();
