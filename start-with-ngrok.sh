#!/bin/bash

echo "🚀 Starting MCP-UI Chat with ngrok tunnels..."
echo ""
echo "⚠️  Make sure you have ngrok installed:"
echo "   brew install ngrok"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok not found. Install it with: brew install ngrok"
    exit 1
fi

# Start backend in background
echo "📦 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend in background
echo "📦 Starting frontend server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 3

echo ""
echo "🌐 Starting ngrok tunnels..."
echo ""
echo "Copy these URLs to use in ChatGPT:"
echo ""

# Start ngrok for backend
echo "Starting backend tunnel..."
ngrok http 3001 > /dev/null &
NGROK_BACKEND_PID=$!

sleep 2

# Start ngrok for frontend in new terminal
echo "Starting frontend tunnel..."
osascript -e 'tell app "Terminal" to do script "ngrok http 3000"'

sleep 2

# Get ngrok URLs
BACKEND_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -1)

echo ""
echo "============================================================"
echo "✅ Servers are running!"
echo "============================================================"
echo ""
echo "Backend URL: $BACKEND_URL"
echo ""
echo "Use this in ChatGPT:"
echo "$BACKEND_URL/mcp/messages?api_key=my-secure-api-key-123"
echo ""
echo "⚠️  Important: Update your backend/.env file:"
echo "   WIDGET_BASE_URL=<your-frontend-ngrok-url>"
echo "   (Check the other terminal window for the frontend URL)"
echo ""
echo "Press Ctrl+C to stop all services"
echo "============================================================"

# Wait for user to stop
wait
