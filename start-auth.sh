#!/bin/bash

# Simple script to start auth service and gateway API

echo "Starting BiteMe Auth Architecture..."
echo "Gateway API: http://localhost:4000"
echo "Auth Service: http://localhost:3001"
echo "Client will connect to: http://localhost:4000/api"
echo ""

# Function to kill processes on exit
cleanup() {
    echo "Shutting down services..."
    pkill -f "node.*auth-service"
    pkill -f "node.*gateway-api"
    exit 0
}

# Trap signals for cleanup
trap cleanup SIGINT SIGTERM

# Start auth service in background
cd services/auth-service
echo "Starting Auth Service on port 3001..."
npm run dev &
AUTH_PID=$!

cd ../gateway-api
echo "Starting Gateway API on port 4000..."
npm run dev &
GATEWAY_PID=$!

# Wait for background processes
wait $AUTH_PID $GATEWAY_PID
