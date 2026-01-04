#!/bin/bash
# Fly.io Secrets Setup Script for Strapi
# embracingearth.space - Enterprise-grade secret management
# This script generates secure keys and sets them in Fly.io

echo "🔐 Strapi Fly.io Secrets Setup"
echo "================================"
echo ""

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI not found. Install from: https://fly.io/docs/getting-started/installing-flyctl/"
    exit 1
fi

# Check if logged in
echo "Checking Fly.io authentication..."
if ! fly auth whoami &> /dev/null; then
    echo "❌ Not logged in to Fly.io. Run: fly auth login"
    exit 1
fi

echo "✅ Authenticated"
echo ""

# Generate secure keys
echo "Generating secure keys..."

KEY1=$(openssl rand -base64 32)
KEY2=$(openssl rand -base64 32)
KEY3=$(openssl rand -base64 32)
KEY4=$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

echo "✅ Keys generated"
echo ""

# Display keys (for user to save)
echo "Generated Keys (save these securely):"
echo "APP_KEYS: $KEY1,$KEY2,$KEY3,$KEY4"
echo "API_TOKEN_SALT: $API_TOKEN_SALT"
echo "ADMIN_JWT_SECRET: $ADMIN_JWT_SECRET"
echo "TRANSFER_TOKEN_SALT: $TRANSFER_TOKEN_SALT"
echo "JWT_SECRET: $JWT_SECRET"
echo ""

# Ask for confirmation
read -p "Set these secrets in Fly.io? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Set secrets
echo ""
echo "Setting secrets in Fly.io..."

# Set APP_KEYS (comma-separated)
fly secrets set "APP_KEYS=$KEY1,$KEY2,$KEY3,$KEY4" -a strapi-cloud-template-blog-3f0dd9f7fb

# Set other secrets
fly secrets set "API_TOKEN_SALT=$API_TOKEN_SALT" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "TRANSFER_TOKEN_SALT=$TRANSFER_TOKEN_SALT" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "JWT_SECRET=$JWT_SECRET" -a strapi-cloud-template-blog-3f0dd9f7fb

# Set required environment variables
fly secrets set "NODE_ENV=production" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "HOST=0.0.0.0" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "PORT=1337" -a strapi-cloud-template-blog-3f0dd9f7fb

echo ""
echo "✅ Secrets set successfully!"
echo ""

# Ask about CORS and PUBLIC_URL
read -p "Set CORS_ORIGIN and PUBLIC_URL? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter CORS_ORIGIN (comma-separated, e.g., https://ai2fin.com,https://www.ai2fin.com): " CORS_ORIGIN
    read -p "Enter PUBLIC_URL (e.g., https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev): " PUBLIC_URL
    
    if [ -n "$CORS_ORIGIN" ]; then
        fly secrets set "CORS_ORIGIN=$CORS_ORIGIN" -a strapi-cloud-template-blog-3f0dd9f7fb
        echo "✅ CORS_ORIGIN set"
    fi
    
    if [ -n "$PUBLIC_URL" ]; then
        fly secrets set "PUBLIC_URL=$PUBLIC_URL" -a strapi-cloud-template-blog-3f0dd9f7fb
        echo "✅ PUBLIC_URL set"
    fi
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Deploy: fly deploy -a strapi-cloud-template-blog-3f0dd9f7fb"
echo "2. Check logs: fly logs -a strapi-cloud-template-blog-3f0dd9f7fb"
echo "3. Open app: fly open -a strapi-cloud-template-blog-3f0dd9f7fb"
echo ""

