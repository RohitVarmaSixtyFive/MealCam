# BiteMe Development and Deployment Automation

.PHONY: help install dev build test clean docker k8s

# Default target
help:
	@echo "BiteMe Makefile Commands:"
	@echo ""
	@echo "Development Commands:"
	@echo "  install          Install dependencies for all services"
	@echo "  dev              Start all services in development mode"
	@echo "  dev-auth         Start auth service only"
	@echo "  dev-meals        Start meals service only"
	@echo "  dev-ai           Start AI parser service only"
	@echo "  dev-gateway      Start gateway service only"
	@echo "  dev-client       Start client application only"
	@echo ""
	@echo "Build Commands:"
	@echo "  build            Build all services"
	@echo "  build-auth       Build auth service"
	@echo "  build-meals      Build meals service"
	@echo "  build-ai         Build AI parser service"
	@echo "  build-gateway    Build gateway service"
	@echo "  build-client     Build client application"
	@echo ""
	@echo "Test Commands:"
	@echo "  test             Run tests for all services"
	@echo "  test-auth        Run auth service tests"
	@echo "  test-meals       Run meals service tests"
	@echo "  test-ai          Run AI parser service tests"
	@echo "  test-gateway     Run gateway service tests"
	@echo "  test-client      Run client tests"
	@echo "  test-coverage    Run tests with coverage report"
	@echo ""
	@echo "Docker Commands:"
	@echo "  docker-build     Build all Docker images"
	@echo "  docker-up        Start all services with Docker Compose"
	@echo "  docker-down      Stop Docker services"
	@echo "  docker-logs      Show Docker logs"
	@echo "  docker-clean     Clean Docker images and containers"
	@echo ""
	@echo "Kubernetes Commands:"
	@echo "  k8s-deploy       Deploy to Kubernetes"
	@echo "  k8s-delete       Delete Kubernetes deployment"
	@echo "  k8s-status       Check Kubernetes deployment status"
	@echo ""
	@echo "Database Commands:"
	@echo "  db-seed          Seed database with sample data"
	@echo "  db-migrate       Run database migrations"
	@echo "  db-backup        Backup database"
	@echo ""
	@echo "Utility Commands:"
	@echo "  lint             Run linting for all services"
	@echo "  format           Format code for all services"
	@echo "  clean            Clean build artifacts and node_modules"
	@echo "  security-check   Run security audit"

# Development Commands
install:
	@echo "Installing dependencies for all services..."
	cd services/auth-service && npm install
	cd services/meals-service && npm install
	cd services/ai-parser-service && npm install
	cd services/gateway-api && npm install
	cd client && npm install

dev:
	@echo "Starting all services in development mode..."
	@echo "Starting MongoDB and Redis..."
	docker-compose -f infra/docker-compose.yml up -d mongodb redis
	@echo "Starting services..."
	concurrently \
		"cd services/auth-service && npm run dev" \
		"cd services/meals-service && npm run dev" \
		"cd services/ai-parser-service && npm run dev" \
		"cd services/gateway-api && npm run dev" \
		"cd client && npm run dev"

dev-auth:
	cd services/auth-service && npm run dev

dev-meals:
	cd services/meals-service && npm run dev

dev-ai:
	cd services/ai-parser-service && npm run dev

dev-gateway:
	cd services/gateway-api && npm run dev

dev-client:
	cd client && npm run dev

# Build Commands
build:
	@echo "Building all services..."
	cd services/auth-service && npm run build
	cd services/meals-service && npm run build
	cd services/ai-parser-service && npm run build
	cd services/gateway-api && npm run build
	cd client && npm run build

build-auth:
	cd services/auth-service && npm run build

build-meals:
	cd services/meals-service && npm run build

build-ai:
	cd services/ai-parser-service && npm run build

build-gateway:
	cd services/gateway-api && npm run build

build-client:
	cd client && npm run build

# Test Commands
test:
	@echo "Running tests for all services..."
	cd services/auth-service && npm test
	cd services/meals-service && npm test
	cd services/ai-parser-service && npm test
	cd services/gateway-api && npm test
	cd client && npm test

test-auth:
	cd services/auth-service && npm test

test-meals:
	cd services/meals-service && npm test

test-ai:
	cd services/ai-parser-service && npm test

test-gateway:
	cd services/gateway-api && npm test

test-client:
	cd client && npm test

test-coverage:
	@echo "Running tests with coverage..."
	cd services/auth-service && npm run test:coverage
	cd services/meals-service && npm run test:coverage
	cd services/ai-parser-service && npm run test:coverage
	cd services/gateway-api && npm run test:coverage
	cd client && npm run test:coverage

# Docker Commands
docker-build:
	@echo "Building Docker images..."
	docker build -t biteme/auth-service ./services/auth-service
	docker build -t biteme/meals-service ./services/meals-service
	docker build -t biteme/ai-parser-service ./services/ai-parser-service
	docker build -t biteme/gateway-api ./services/gateway-api
	docker build -t biteme/client ./client

docker-up:
	@echo "Starting services with Docker Compose..."
	docker-compose -f infra/docker-compose.yml up -d

docker-down:
	@echo "Stopping Docker services..."
	docker-compose -f infra/docker-compose.yml down

docker-logs:
	docker-compose -f infra/docker-compose.yml logs -f

docker-clean:
	@echo "Cleaning Docker images and containers..."
	docker-compose -f infra/docker-compose.yml down -v
	docker system prune -f
	docker volume prune -f

# Kubernetes Commands
k8s-deploy:
	@echo "Deploying to Kubernetes..."
	kubectl apply -f infra/k8s/

k8s-delete:
	@echo "Deleting Kubernetes deployment..."
	kubectl delete -f infra/k8s/

k8s-status:
	@echo "Checking Kubernetes deployment status..."
	kubectl get pods,services,deployments,ingress

# Database Commands
db-seed:
	@echo "Seeding database with sample data..."
	node scripts/seed-database.js

db-migrate:
	@echo "Running database migrations..."
	node scripts/migrate-database.js

db-backup:
	@echo "Backing up database..."
	mongodump --uri $(MONGODB_URI) --out ./backups/$(shell date +%Y%m%d_%H%M%S)

# Utility Commands
lint:
	@echo "Running linting for all services..."
	cd services/auth-service && npm run lint
	cd services/meals-service && npm run lint
	cd services/ai-parser-service && npm run lint
	cd services/gateway-api && npm run lint
	cd client && npm run lint

format:
	@echo "Formatting code for all services..."
	cd services/auth-service && npm run format
	cd services/meals-service && npm run format
	cd services/ai-parser-service && npm run format
	cd services/gateway-api && npm run format
	cd client && npm run format

clean:
	@echo "Cleaning build artifacts and node_modules..."
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	find . -name ".next" -type d -prune -exec rm -rf '{}' +
	find . -name "dist" -type d -prune -exec rm -rf '{}' +
	find . -name "build" -type d -prune -exec rm -rf '{}' +

security-check:
	@echo "Running security audit..."
	cd services/auth-service && npm audit
	cd services/meals-service && npm audit
	cd services/ai-parser-service && npm audit
	cd services/gateway-api && npm audit
	cd client && npm audit

# Production Commands
prod-deploy:
	@echo "Deploying to production..."
	@echo "Building production images..."
	make docker-build
	@echo "Pushing to registry..."
	docker push biteme/auth-service:latest
	docker push biteme/meals-service:latest
	docker push biteme/ai-parser-service:latest
	docker push biteme/gateway-api:latest
	docker push biteme/client:latest
	@echo "Updating Kubernetes deployment..."
	kubectl set image deployment/auth-service auth-service=biteme/auth-service:latest
	kubectl set image deployment/meals-service meals-service=biteme/meals-service:latest
	kubectl set image deployment/ai-parser-service ai-parser-service=biteme/ai-parser-service:latest
	kubectl set image deployment/gateway-api gateway-api=biteme/gateway-api:latest
	kubectl set image deployment/biteme-client biteme-client=biteme/client:latest

health-check:
	@echo "Checking service health..."
	curl -f http://localhost:3001/health || echo "Auth service down"
	curl -f http://localhost:3002/health || echo "Meals service down"
	curl -f http://localhost:3003/health || echo "AI service down"
	curl -f http://localhost:3000/health || echo "Gateway down"

setup-dev:
	@echo "Setting up development environment..."
	cp .env.example .env
	make install
	@echo "Starting MongoDB and Redis..."
	docker-compose -f infra/docker-compose.yml up -d mongodb redis
	@echo "Waiting for services to start..."
	sleep 10
	@echo "Development environment ready!"
	@echo "Run 'make dev' to start all services"

# CI/CD Commands
ci-test:
	@echo "Running CI tests..."
	make lint
	make test
	make security-check

ci-build:
	@echo "Running CI build..."
	make build
	make docker-build
