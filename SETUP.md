# BiteMe Application Setup Guide

## Quick Start

This guide will walk you through setting up the BiteMe application on your local machine.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Gemini API key
- Cloudinary account

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

Copy the `.env` file in the root directory and update it with your actual values:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/biteme?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Gemini AI API
GEMINI_API_KEY=your-gemini-api-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
PORT=5000
NODE_ENV=development

# Client Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Getting API Keys

#### MongoDB Atlas:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get your connection string

#### Google Gemini API:
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project
3. Enable the Gemini API
4. Create an API key

#### Cloudinary:
1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Get your cloud name, API key, and API secret from the dashboard

### 4. Start the Application

```bash
# Start both server and client (from root directory)
npm run dev

# Or start individually:
# Server (port 5000)
npm run server:dev

# Client (port 3000)
npm run client:dev
```

## Project Structure Overview

```
biteme/
├── client/                    # Next.js frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Next.js pages
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # Global styles
│   └── package.json
├── server/                   # Node.js backend
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # External services
│   │   ├── middlewares/     # Express middlewares
│   │   └── utils/           # Utility functions
│   └── package.json
├── .env                     # Environment variables
├── package.json            # Root package.json
└── README.md
```

## Key Features Implemented

### Backend:
- **Authentication**: JWT-based user registration and login
- **Meal Management**: CRUD operations for meals
- **AI Integration**: Gemini API for meal analysis
- **Image Upload**: Cloudinary integration
- **Database**: MongoDB with Mongoose
- **Validation**: Joi validation for API inputs

### Frontend:
- **Pages**: Home, Login, Dashboard (placeholders for other pages)
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Query for server state
- **Type Safety**: Full TypeScript support
- **Responsive**: Mobile-first design

## Files That Need Implementation

The following files contain placeholders and need to be fully implemented:

### Client Side:
1. `src/pages/signup.tsx` - User registration page
2. `src/pages/meals/add.tsx` - Add meal with photo upload
3. `src/pages/meals/history.tsx` - Meal history view
4. `src/components/` - All UI components
5. `src/hooks/` - Custom React hooks
6. `src/contexts/` - React contexts for auth and meals

### Server Side:
1. `src/controllers/` - Route controllers (currently logic is in routes)
2. `src/services/nutritionService.js` - Nutrition calculation service
3. Full implementation of AI analysis workflow

## Development Notes

### Current Status:
- ✅ Project structure created
- ✅ Database models defined
- ✅ Basic API routes implemented
- ✅ Authentication middleware
- ✅ AI service integration
- ✅ Basic frontend pages
- ✅ TypeScript types defined

### Next Steps:
1. Implement missing React components
2. Add form validation on frontend
3. Implement image upload UI
4. Add meal editing functionality
5. Create progress tracking charts
6. Add saved meals feature
7. Implement responsive design improvements

### Important Implementation Notes:

1. **Image Upload Flow**:
   - User uploads image → Cloudinary → Gemini API → Nutrition calculation → Database

2. **Authentication Flow**:
   - JWT tokens stored in localStorage
   - Automatic token refresh on API calls
   - Protected routes redirect to login

3. **Data Flow**:
   - React Query for API state management
   - TypeScript for type safety
   - Joi validation on backend

## Testing

```bash
# Run server tests (when implemented)
cd server
npm test

# Run client tests (when implemented)
cd client
npm test
```

## Deployment

### Server (Render/Railway):
1. Connect your GitHub repository
2. Set environment variables
3. Deploy from main branch

### Client (Vercel):
1. Connect your GitHub repository
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/.next`
4. Deploy from main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add appropriate tests
5. Submit a pull request

## Support

For issues or questions, please create an issue in the GitHub repository.

---

**Note**: This is a comprehensive starting structure. Some features may need additional implementation based on specific requirements.
