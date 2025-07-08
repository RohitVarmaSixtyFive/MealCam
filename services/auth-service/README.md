# BiteMe Auth Service

Authentication microservice for the BiteMe application, handling user registration, login, JWT token management, and user profile operations.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- Rate limiting
- Error handling
- Health check endpoint
- Docker support

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Health Check
- `GET /health` - Service health status

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
AUTH_DB_URI=mongodb://localhost:27017/biteme_auth
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
AUTH_SERVICE_PORT=3001
CLIENT_URL=http://localhost:3000
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
docker build -t biteme-auth-service .

# Run container
docker run -p 3001:3001 --env-file .env biteme-auth-service
```

## Testing

```bash
npm test
```

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Profile (requires JWT token)
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
