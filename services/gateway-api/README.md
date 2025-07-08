# BiteMe API Gateway

Central API gateway for the BiteMe microservices architecture, handling request routing, authentication, rate limiting, and service orchestration.

## Features

- **Request Routing**: Intelligent routing to appropriate microservices
- **Authentication**: Centralized JWT token validation
- **Rate Limiting**: Service-specific rate limiting and abuse prevention
- **Load Balancing**: Distribute requests across service instances
- **Health Monitoring**: Monitor and report service health status
- **Error Handling**: Centralized error handling and logging
- **CORS**: Cross-origin resource sharing configuration
- **Security**: Request validation and security headers

## Architecture

The gateway acts as the single entry point for all client requests and routes them to the appropriate microservices:

- Authentication requests → Auth Service (port 3001)
- Meal and nutrition requests → Meals Service (port 3002)
- AI analysis requests → AI Parser Service (port 3003)

## API Routes

### Authentication
- `POST /api/auth/*` - All auth operations (proxied to auth service)

### Meals & Nutrition
- `GET|POST|PUT|DELETE /api/meals/*` - Meal operations (proxied to meals service)
- `GET|POST /api/meals/nutrition/*` - Nutrition operations (proxied to meals service)

### AI Analysis
- `POST /api/ai/*` - AI analysis operations (proxied to AI service)

### Health & Status
- `GET /health` - Gateway and services health status

## Environment Variables

```bash
GATEWAY_PORT=3000
JWT_SECRET=your_jwt_secret
AUTH_SERVICE_URL=http://localhost:3001
MEALS_SERVICE_URL=http://localhost:3002
AI_SERVICE_URL=http://localhost:3003
REDIS_URL=redis://localhost:6379
```

## Rate Limiting

Different rate limits are applied based on the service:

- **Auth Service**: 10 requests per 15 minutes
- **Meals Service**: 100 requests per 15 minutes  
- **AI Service**: 20 requests per 15 minutes (due to processing costs)

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
docker build -t biteme-gateway-api .
docker run -p 3000:3000 --env-file .env biteme-gateway-api
```

## Testing

```bash
npm test
```

## Service Discovery

The gateway maintains a service registry with health monitoring:

- Automatic service registration
- Health check monitoring (30-second intervals)
- Circuit breaker pattern for failed services
- Automatic failover and retry logic

## Security Features

- JWT token validation
- Request sanitization
- Rate limiting per user and IP
- CORS policy enforcement
- Security headers injection
- Request/response logging

## Monitoring

- Service health dashboard
- Request/response metrics
- Error rate monitoring
- Performance analytics
- Real-time service status
