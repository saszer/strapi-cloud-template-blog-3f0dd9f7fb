#!/bin/bash
# Fly.io Deployment Script for Strapi CMS
# Cost-optimized deployment with always-available architecture
# embracingearth.space - Enterprise-grade deployment automation

set -e  # Exit on error

echo "🚀 Starting Fly.io deployment for Strapi CMS..."

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI not found. Please install it first:"
    echo "   curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if logged in
if ! fly auth whoami &> /dev/null; then
    echo "⚠️  Not logged in to Fly.io. Logging in..."
    fly auth login
fi

# Check if app exists
if ! fly status &> /dev/null; then
    echo "📦 Initializing Fly.io app..."
    fly launch --no-deploy --copy-config
    echo "✅ App initialized. Please configure secrets before deploying."
    echo ""
    echo "Next steps:"
    echo "1. Create PostgreSQL database: fly postgres create --name ai2fin-strapi-db --region iad --vm-size shared-cpu-1x --volume-size 3"
    echo "2. Attach database: fly postgres attach ai2fin-strapi-db"
    echo "3. Set secrets (see FLY_DEPLOYMENT.md)"
    echo "4. Run this script again to deploy"
    exit 0
fi

echo "🔍 Checking app status..."
fly status

echo ""
echo "📤 Deploying to Fly.io..."
fly deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔗 Your app is available at:"
fly status | grep "Hostname" || fly open --show

echo ""
echo "📊 View logs: fly logs"
echo "🔍 Check status: fly status"
