#!/bin/bash

# Kill any processes on ports 3000, 3001, 3002
echo "Clearing ports 3000, 3001, 3002..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "Port 3000 clear"
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "Port 3001 clear"
lsof -ti:3002 | xargs kill -9 2>/dev/null || echo "Port 3002 clear"

# Start development server
echo "Starting development server on port 3000..."
PORT=3000 npm run dev 