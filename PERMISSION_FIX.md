# 🔒 Permission Fix: EACCES Error on .env File

## Problem

Strapi crashes with:
```
EACCES: permission denied, open '/app/.env'
```

This happens because Strapi's `users-permissions` plugin tries to write JWT secrets to `.env` during bootstrap, but the non-root user doesn't have write permissions.

## Solution

The Dockerfile has been updated to:
1. Create `.env` file before switching to non-root user
2. Set proper ownership (`strapi:nodejs`)
3. Set write permissions (644 - owner can read/write)

## What Was Fixed

**Dockerfile changes:**
- Creates `.env` file with `touch /app/.env`
- Sets ownership: `chown strapi:nodejs /app/.env`
- Sets permissions: `chmod 644 /app/.env` (read-write for owner)

## Deploy the Fix

```bash
# Rebuild and deploy
fly deploy -a strapi-cloud-template-blog-3f0dd9f7fb

# Monitor logs
fly logs -a strapi-cloud-template-blog-3f0dd9f7fb
```

## Why This Happens

Strapi's `users-permissions` plugin automatically generates JWT secrets on first run and tries to save them to `.env` for persistence. In production with Fly.io secrets, we don't need this (secrets are in Fly.io), but the plugin still tries to write to `.env` during bootstrap.

The fix ensures the file exists and is writable, so Strapi can complete its bootstrap process without errors.

## Note on CORS Warning

The CORS warning about `enabled` option is already fixed in `config/middlewares.js`. After deploying, this warning will disappear.

---

*embracingearth.space - Enterprise-grade permission management*

