#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Function to clean up background processes on exit
cleanup() {
    echo "Stopping background processes..."
    # Kill all processes in the current process group
    kill 0
}

# Trap EXIT signal to call cleanup function
trap cleanup EXIT

echo "Starting backend (Spring Boot)..."
mvn spring-boot:run &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo "Starting frontend (Vite)..."
cd frontend
npm install # Ensure dependencies are installed
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

echo "Backend and Frontend development servers are starting."
echo "Backend API likely on http://localhost:8005"
echo "Frontend likely on http://localhost:5173 (check Vite output)"
echo "Press Ctrl+C to stop both servers."

# Wait for either process to exit.
# The 'wait' command without arguments waits for all background jobs.
# The trap will handle cleanup when the script exits (e.g., via Ctrl+C).
wait