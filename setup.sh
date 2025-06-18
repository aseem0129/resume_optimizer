#!/bin/bash

echo "🚀 Setting up Resume Optimizer Application"
echo "=========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Python and Node.js are installed"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/uploads
mkdir -p backend/static/pdfs
mkdir -p backend/app/utils/templates

# Setup Backend
echo "🐍 Setting up Python backend..."
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your OpenAI API key"
fi

cd ..

# Setup Frontend
echo "⚛️  Setting up React frontend..."
cd frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.local.example .env.local
fi

cd ..

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env and add your OpenAI API key"
echo "2. Start the backend: cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo "3. Start the frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "🔑 Get your OpenAI API key from: https://platform.openai.com/api-keys"
echo "" 