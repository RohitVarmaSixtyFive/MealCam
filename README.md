# MealCam - AI-Powered Nutritional Tracking

MealCam is a mobile web application that simplifies nutritional tracking by allowing users to log meals with a single photo. Using AI-powered meal recognition, users can upload an image of their meal and receive an editable nutritional breakdown.

## Features

- **Photo-based meal logging**: Upload a photo and get AI-generated meal descriptions
- **Editable nutritional data**: Modify AI suggestions to match your actual meal
- **Progress tracking**: View your nutritional intake over time
- **Saved meals**: Save common meals for quick logging
- **Mobile-optimized**: Responsive design for mobile and desktop

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Query** for state management
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for image storage
- **Google Gemini API** for AI meal recognition

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Gemini API key
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone https://github.com/RohitVarmaSixtyFive/MealCam.git
cd MealCam
```

2. Install dependencies
```bash
npm run install:all
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your actual values
```

4. Start the development servers
```bash
npm run dev
```

This will start both the client (port 3000) and server (port 5000) concurrently.

## Project Structure

```
biteme/
├── client/                 # Frontend (Next.js)
├── server/                 # Backend (Node.js/Express)
├── .env                   # Environment variables
├── package.json           # Root package.json
└── README.md             # This file
```

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/meals` - Create a new meal
- `GET /api/meals` - Get user's meals
- `POST /api/upload` - Upload meal image
- `GET /api/saved-foods` - Get saved food items

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
