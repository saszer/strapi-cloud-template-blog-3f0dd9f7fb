# 🔐 Fly.io Secrets Fix - Required Environment Variables

## Problem

Strapi is crashing on Fly.io with the error:
```
Middleware "strapi::session": App keys are required. Please set app.keys in config/server.js
```

## Root Cause

The `APP_KEYS` environment variable is not set in Fly.io. Strapi requires this for session middleware to work.

## Solution

Set the required secrets in Fly.io using one of these methods:

### Method 1: Automated Script (Recommended)

**Windows (PowerShell):**
```powershell
.\setup-fly-secrets.ps1
```

**Linux/Mac:**
```bash
chmod +x setup-fly-secrets.sh
./setup-fly-secrets.sh
```

### Method 2: Manual Setup

1. **Generate secure keys:**
   ```bash
   # Run this 8 times to generate 8 different keys
   openssl rand -base64 32
   ```

2. **Set secrets in Fly.io:**
   ```bash
   # Set APP_KEYS (comma-separated, use 4 generated keys)
   fly secrets set "APP_KEYS=key1,key2,key3,key4" -a strapi-cloud-template-blog-3f0dd9f7fb
   
   # Set other required secrets (use remaining 4 keys)
   fly secrets set "API_TOKEN_SALT=key5" -a strapi-cloud-template-blog-3f0dd9f7fb
   fly secrets set "ADMIN_JWT_SECRET=key6" -a strapi-cloud-template-blog-3f0dd9f7fb
   fly secrets set "TRANSFER_TOKEN_SALT=key7" -a strapi-cloud-template-blog-3f0dd9f7fb
   fly secrets set "JWT_SECRET=key8" -a strapi-cloud-template-blog-3f0dd9f7fb
   
   # Set required environment variables
   fly secrets set "NODE_ENV=production" -a strapi-cloud-template-blog-3f0dd9f7fb
   fly secrets set "HOST=0.0.0.0" -a strapi-cloud-template-blog-3f0dd9f7fb
   fly secrets set "PORT=1337" -a strapi-cloud-template-blog-3f0dd9f7fb
   ```

3. **Optional: Set CORS and Public URL:**
   ```bash
   fly secrets set "CORS_ORIGIN=https://ai2fin.com,https://www.ai2fin.com" -a strapi-cloud-template-blog-3f0dd9f7fb
   fly secrets set "PUBLIC_URL=https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev" -a strapi-cloud-template-blog-3f0dd9f7fb
   ```

## Required Secrets

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_KEYS` | ✅ **YES** | Comma-separated keys for session middleware (4 keys) |
| `API_TOKEN_SALT` | ✅ **YES** | Salt for API tokens |
| `ADMIN_JWT_SECRET` | ✅ **YES** | Secret for admin JWT |
| `TRANSFER_TOKEN_SALT` | ✅ **YES** | Salt for transfer tokens |
| `JWT_SECRET` | ✅ **YES** | Secret for JWT authentication |
| `NODE_ENV` | ✅ **YES** | Set to "production" |
| `HOST` | ✅ **YES** | Set to "0.0.0.0" |
| `PORT` | ✅ **YES** | Set to "1337" |
| `CORS_ORIGIN` | ⚠️ Recommended | Comma-separated allowed origins |
| `PUBLIC_URL` | ⚠️ Recommended | Public URL for media files |

## Verify Secrets

```bash
# List all secrets
fly secrets list -a strapi-cloud-template-blog-3f0dd9f7fb

# Check if APP_KEYS is set
fly secrets list -a strapi-cloud-template-blog-3f0dd9f7fb | grep APP_KEYS
```

## Deploy After Setting Secrets

```bash
# Deploy the updated configuration
fly deploy -a strapi-cloud-template-blog-3f0dd9f7fb

# Monitor logs
fly logs -a strapi-cloud-template-blog-3f0dd9f7fb

# Open app
fly open -a strapi-cloud-template-blog-3f0dd9f7fb
```

## What Was Fixed

1. **`config/server.js`**: Added clear error message if `APP_KEYS` is missing
2. **`config/middlewares.js`**: Removed deprecated `enabled` option from CORS config
3. **`src/bootstrap.js`**: Made seed data loading conditional (won't crash if missing)

## Security Notes

- **Never commit secrets to git**
- **Use strong, unique keys for production**
- **Rotate keys regularly**
- **Store keys securely** (Fly.io secrets are encrypted)

---

*embracingearth.space - Enterprise-grade secret management*

