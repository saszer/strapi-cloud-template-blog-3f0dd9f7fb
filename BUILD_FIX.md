# 🔧 Build Fix: APP_KEYS During Docker Build

## Problem

Docker build fails with:
```
Error: Could not load js config file /app/config/server.js: APP_KEYS environment variable is required.
```

This happens because:
- During `npm run build` (which runs `strapi build`), Strapi loads all config files
- `config/server.js` requires `APP_KEYS` to be set
- **Fly.io secrets are only available at runtime, not during build**

## Solution

Updated `config/server.js` to:
1. **During build**: Use placeholder keys if `APP_KEYS` is not set (allows build to complete)
2. **At runtime**: Use real keys from Fly.io secrets (set via `fly secrets set`)

## What Changed

**Before:**
- Config threw error immediately if `APP_KEYS` missing
- Build failed because secrets aren't available during build

**After:**
- Config uses placeholder keys during build if `APP_KEYS` not set
- At runtime, Fly.io secrets provide real keys
- If secrets not set at runtime, session middleware will fail with clear error

## Deploy

```bash
# Build should now succeed
fly deploy -a strapi-cloud-template-blog-3f0dd9f7fb

# Make sure secrets are set for runtime
fly secrets list -a strapi-cloud-template-blog-3f0dd9f7fb
```

## Important: Set Secrets Before Runtime

Even though build works without secrets, **you must set secrets before the app runs**:

```bash
# Set all required secrets (see FLY_SECRETS_FIX.md)
fly secrets set "APP_KEYS=key1,key2,key3,key4" -a strapi-cloud-template-blog-3f0dd9f7fb
# ... (set other secrets)
```

---

*embracingearth.space - Enterprise-grade build-time vs runtime configuration*

