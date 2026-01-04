# 🔧 Fix: Missing 'pg' Module Error

## Problem

Strapi crashes with:
```
Error: Cannot find module 'pg'
```

This happens because:
- You set `DATABASE_URL` to PostgreSQL (Neon)
- Strapi tries to use PostgreSQL
- But `pg` package (PostgreSQL driver) is not installed

## Solution

**Fixed:** Added `pg` package to `package.json`

**What was changed:**
- Added `"pg": "^8.11.3"` to dependencies
- This is the PostgreSQL driver for Node.js

## Deploy the Fix

**Rebuild and deploy:**
```powershell
fly deploy -a strapi-cloud-template-blog-3f0dd9f7fb
```

The Docker build will now:
1. Install `pg` package
2. Build native bindings (needs python3, make, g++ - already in Dockerfile)
3. Include it in production image

## Verify

**After deployment, check logs:**
```powershell
fly logs -a strapi-cloud-template-blog-3f0dd9f7fb
```

**Should see:**
- ✅ No "Cannot find module 'pg'" error
- ✅ Database connection successful
- ✅ Strapi starts normally

---

*embracingearth.space - Enterprise-grade dependency management*

