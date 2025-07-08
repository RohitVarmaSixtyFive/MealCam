# BiteMe AI Parser Service

AI-powered food recognition and nutritional analysis service using Google Gemini Vision API.

## Features

- **Food Recognition**: Analyze food images using advanced AI models
- **Nutrition Estimation**: Estimate nutritional content from recognized foods
- **Text Parsing**: Parse food descriptions and extract ingredients
- **Recipe Analysis**: Analyze recipes and calculate nutritional information
- **Confidence Scoring**: Provide confidence scores for all AI predictions

## API Endpoints

### Image Analysis
- `POST /api/ai/analyze-image` - Analyze food image
- `POST /api/ai/parse-text` - Parse food description text
- `POST /api/ai/estimate-nutrition` - Estimate nutrition from food items
- `POST /api/ai/analyze-recipe` - Analyze recipe ingredients

## Environment Variables

```bash
AI_SERVICE_PORT=3003
GEMINI_API_KEY=your_gemini_api_key
CONFIDENCE_THRESHOLD=0.7
MAX_RETRY_ATTEMPTS=3
AI_TIMEOUT=30000
```

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm start
```

## Docker

```bash
docker build -t biteme-ai-parser-service .
docker run -p 3003:3003 --env-file .env biteme-ai-parser-service
```

## Testing

```bash
npm test
```

## AI Integration

This service integrates with Google Gemini Vision API for food recognition. Ensure you have a valid API key configured in your environment variables.

### Supported Features
- Multi-food recognition in single images
- Portion size estimation
- Nutritional content estimation
- Ingredient identification
- Recipe parsing and analysis
