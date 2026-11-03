#!/bin/bash

set -e

echo "🎭 Setting up Playwright testing environment..."
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ is required (you have v$(node -v))"
  exit 1
fi
echo "  Node.js version: $(node -v)"

# Check npm
echo ""
echo "✓ Checking npm..."
echo "  npm version: $(npm -v)"

# Install dependencies
echo ""
echo "✓ Installing dependencies..."
npm ci

# Install Playwright
echo ""
echo "✓ Installing Playwright browsers..."
npm run playwright:install

# Check Docker
echo ""
echo "✓ Checking Docker..."
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker to run tests."
  exit 1
fi
echo "  Docker version: $(docker --version)"

# Check Docker Compose
echo ""
if ! command -v docker-compose &> /dev/null; then
  echo "⚠️  docker-compose not found, trying with 'docker compose'..."
  if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    exit 1
  fi
  echo "  Using: docker compose"
else
  echo "✓ Docker Compose is available"
  echo "  Docker Compose version: $(docker-compose --version)"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the test environment:"
echo "   docker-compose -f docker-compose.test.yml up -d"
echo ""
echo "2. Run tests:"
echo "   npm run test:e2e          # Run all tests headless"
echo "   npm run test:e2e:headed   # Run tests with browser visible"
echo "   npm run test:e2e:ui       # Run tests with interactive UI"
echo ""
echo "3. View test report:"
echo "   npm run playwright:report"
echo ""
echo "For more information, see docs/PLAYWRIGHT_SETUP.md"
