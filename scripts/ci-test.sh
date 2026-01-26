#!/bin/bash

echo "🔄 Running CI simulation locally..."
echo ""

# Set CI environment
export CI=true

echo "📦 Installing dependencies..."
npm ci

echo ""
echo "🎭 Installing Playwright browsers..."
npx playwright install --with-deps

echo ""
echo "🧪 Running tests..."
npx playwright test --reporter=list,html

echo ""
echo "✅ CI simulation completed!"
echo "📊 Open HTML report: npx playwright show-report"