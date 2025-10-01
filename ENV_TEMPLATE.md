# Environment Variables Template

**Copy this content to `.env` file in the root directory**

```env
# Server Configuration
# embracingearth.space - Enterprise-grade environment setup
# Designed for 100k+ concurrent users with proper security isolation

HOST=0.0.0.0
PORT=1337

# Application Keys (REQUIRED - Generate secure keys for production)
# Generate with: openssl rand -base64 32
APP_KEYS="toBeModified1,toBeModified2"
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
TRANSFER_TOKEN_SALT=tobemodified
JWT_SECRET=tobemodified

# Database Configuration
# For production: Use PostgreSQL or MySQL for scalability
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# For PostgreSQL (recommended for production):
# DATABASE_CLIENT=postgres
# DATABASE_HOST=127.0.0.1
# DATABASE_PORT=5432
# DATABASE_NAME=strapi
# DATABASE_USERNAME=strapi
# DATABASE_PASSWORD=strapi
# DATABASE_SSL=false

# For MySQL:
# DATABASE_CLIENT=mysql
# DATABASE_HOST=127.0.0.1
# DATABASE_PORT=3306
# DATABASE_NAME=strapi
# DATABASE_USERNAME=strapi
# DATABASE_PASSWORD=strapi
# DATABASE_SSL=false

# CORS Configuration
# Add your frontend domains (comma-separated)
CORS_ORIGIN=http://localhost:3000,https://ai2fin.com,https://www.ai2fin.com

# Public URL (for media files and links)
PUBLIC_URL=https://automatic-positivity-3a6b42eb07.strapiapp.com

# Admin Panel URL
ADMIN_URL=/admin

# Cloudflare/CDN Configuration (optional for production)
# CDN_URL=https://your-cdn.com

# Email Configuration (optional - for notifications)
# EMAIL_PROVIDER=sendgrid
# EMAIL_PROVIDER_API_KEY=your-api-key
# EMAIL_DEFAULT_FROM=noreply@ai2fin.com
# EMAIL_DEFAULT_REPLY_TO=support@ai2fin.com

# Upload Provider (optional - S3, Cloudinary, etc.)
# UPLOAD_PROVIDER=aws-s3
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_REGION=us-east-1
# AWS_BUCKET=strapi-uploads

# Performance & Caching
# NODE_ENV=production
# CACHE_ENABLED=true

# Rate Limiting (for DDoS protection)
# RATE_LIMIT_ENABLED=true
# RATE_LIMIT_MAX_REQUESTS=100
# RATE_LIMIT_DURATION=60000

# Analytics & Monitoring
# SENTRY_DSN=your-sentry-dsn
# ANALYTICS_ENABLED=true
```

## Quick Setup

1. Copy this content to a new file named `.env` in the root directory
2. Generate secure keys: `openssl rand -base64 32`
3. Update `APP_KEYS` with generated keys
4. Update `CORS_ORIGIN` with your frontend domain(s)
5. For production, switch to PostgreSQL database

## Security Notes

- **NEVER** commit `.env` to version control
- Use unique, strong keys for production
- Keep secrets secure and rotate regularly
- Use environment-specific `.env` files (.env.production, .env.staging)

