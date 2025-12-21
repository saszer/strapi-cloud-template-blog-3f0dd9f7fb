#!/bin/bash

# Newsletter Schema Fix Deployment Script
# Fixes 500 error by adding "blog" source to newsletter-subscriber schema
# Built by embracingearth.space 🌍

echo "🚀 Deploying newsletter schema fix..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from strapi project root"
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building Strapi project..."
npm run build

# Restart Strapi (this will apply schema changes)
echo "🔄 Restarting Strapi server..."
echo "   - Schema changes will be applied automatically"
echo "   - Database migrations will run if needed"

# For development
if [ "$NODE_ENV" != "production" ]; then
    echo "🛠️  Starting development server..."
    npm run develop
else
    echo "🏭 Starting production server..."
    npm start
fi

echo "✅ Newsletter schema fix deployed!"
echo "   - Added 'blog' source to newsletter-subscriber enum"
echo "   - Newsletter signup from /blog should now work"
echo "   - Check logs for any remaining issues"


