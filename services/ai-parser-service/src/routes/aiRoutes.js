const express = require('express');
const router = express.Router();
const aiController = require('../services/aiController');

// Food recognition from image
router.post('/analyze-image', aiController.analyzeImage);

// Text-based food parsing
router.post('/parse-text', aiController.parseText);

// Nutrition estimation
router.post('/estimate-nutrition', aiController.estimateNutrition);

// Recipe analysis
router.post('/analyze-recipe', aiController.analyzeRecipe);

module.exports = router;
