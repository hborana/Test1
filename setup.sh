#!/bin/bash

echo "🚀 Setting up MCP-UI Chat (OpenAI ChatGPT App)..."

# Install Backend dependencies
echo "\n📦 Installing Backend dependencies..."
cd backend && npm install
cd ..

# Install Frontend dependencies (serve for static widgets)
echo "\n📦 Installing Frontend dependencies..."
cd frontend && npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
  echo "\n⚙️  Creating .env file..."
  cp backend/.env.example backend/.env
  echo "✅ Created backend/.env"
else
  echo "\n✅ backend/.env already exists"
fi

echo "\n✅ Setup complete!"
echo "\n📝 Next steps:"
echo "1. Edit backend/.env if needed (set ADMIN_API_KEY)"
echo "2. Run 'cd backend && npm start' in one terminal"
echo "3. Run 'cd frontend && npm start' in another terminal"
echo "4. Open ChatGPT, enable Developer Mode, and create an app"
echo "5. Use the MCP URL shown in the backend console"
echo "\n🎉 Happy building!"

