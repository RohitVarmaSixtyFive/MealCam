# BiteMe Meals Service

Microservice for handling meal tracking, nutrition analysis, and food database operations in the BiteMe application.

## Features

- Meal creation and management
- Image upload and processing
- Nutrition tracking and analysis
- Food database integration
- Calorie calculation and aggregation
- Meal history and analytics
- Public meal sharing
- Search and filtering

## API Endpoints

### Meals
- `GET /api/meals` - Get user's meals
- `POST /api/meals` - Create new meal
- `GET /api/meals/:id` - Get specific meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal
- `POST /api/meals/upload` - Upload meal image

### Nutrition
- `GET /api/nutrition/daily` - Daily nutrition summary
- `GET /api/nutrition/weekly` - Weekly nutrition trends
- `GET /api/nutrition/monthly` - Monthly nutrition analysis
- `GET /api/nutrition/goals` - Get nutrition goals
- `POST /api/nutrition/goals` - Set nutrition goals

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
MEALS_DB_URI=mongodb://localhost:27017/biteme_meals
MEALS_SERVICE_PORT=3002
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Docker

```bash
# Build image
docker build -t biteme-meals-service .

# Run container
docker run -p 3002:3002 --env-file .env biteme-meals-service
```

## Testing

```bash
npm test
```

## Features in Development

- AI-powered food recognition from images
- Barcode scanning for packaged foods
- Recipe import and nutrition calculation
- Social features for meal sharing
- Advanced nutrition analytics
- Integration with fitness trackers
