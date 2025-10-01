# 🔐 API Permissions Setup Guide

**Configure public access for blog content while maintaining security**

---

## Quick Setup (Via Admin Panel)

### 1. Access Permissions Settings

1. Log in to Strapi admin: `http://localhost:1337/admin`
2. Navigate to **Settings** (gear icon) → **Users & Permissions Plugin** → **Roles**
3. Click on **Public** role

### 2. Configure Article Permissions

Under **Article** section, enable:
- ✅ `find` - Get list of articles
- ✅ `findOne` - Get single article by ID

**Leave disabled:**
- ❌ `create` - Prevent public article creation
- ❌ `update` - Prevent public updates
- ❌ `delete` - Prevent public deletion

### 3. Configure Author Permissions

Under **Author** section, enable:
- ✅ `find` - Get list of authors
- ✅ `findOne` - Get single author by ID

### 4. Configure Category Permissions

Under **Category** section, enable:
- ✅ `find` - Get list of categories
- ✅ `findOne` - Get single category by ID

### 5. Configure Tag Permissions

Under **Tag** section, enable:
- ✅ `find` - Get list of tags
- ✅ `findOne` - Get single tag by ID

### 6. Save Changes

Click **Save** button in top-right corner.

---

## Testing Public Access

After configuring permissions, test the API:

### Test Article Endpoint
```bash
curl http://localhost:1337/api/articles?populate=*
```

Expected: JSON response with articles array

### Test Single Article
```bash
curl http://localhost:1337/api/articles/1?populate=*
```

Expected: JSON response with single article

### Test Categories
```bash
curl http://localhost:1337/api/categories
```

Expected: JSON response with categories array

### Test Tags
```bash
curl http://localhost:1337/api/tags
```

Expected: JSON response with tags array

---

## Authenticated Access (Admin/Editor)

For write operations (create/update/delete), create an API token:

### 1. Create API Token

1. Go to **Settings** → **API Tokens**
2. Click **Create new API Token**
3. Configure:
   - **Name**: `Frontend Admin`
   - **Token type**: `Full access` or `Custom`
   - **Duration**: `Unlimited` or `7 days` (your choice)

4. If Custom, select permissions:
   - Article: `create`, `update`, `delete`
   - Author: `create`, `update`, `delete`
   - Category: `create`, `update`, `delete`
   - Tag: `create`, `update`, `delete`

5. Click **Save**
6. **Copy the token** (shown once!)

### 2. Use Token in Frontend

Add to frontend `.env.local`:

```env
STRAPI_API_TOKEN=your-generated-token-here
```

### 3. Test Authenticated Request

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:1337/api/articles
```

---

## Security Best Practices

### ✅ DO:
- Enable only `find` and `findOne` for public access
- Use API tokens for write operations
- Set token expiration dates
- Rotate tokens regularly
- Use HTTPS in production
- Configure CORS with specific origins

### ❌ DON'T:
- Enable `create`, `update`, `delete` for Public role
- Share API tokens publicly
- Commit tokens to version control
- Use same token for dev and production
- Allow unrestricted CORS (`*`)

---

## Role-Based Access Control

### Public Role
- Read-only access to blog content
- No authentication required
- Perfect for frontend blog display

### Authenticated Role
- Requires user login
- Can create/edit own content
- Limited permissions

### Editor/Author Role (Custom)
Create custom roles for content creators:

1. Go to **Settings** → **Roles** → **Create new role**
2. Name: `Content Editor`
3. Enable permissions:
   - Article: `create`, `update`, `find`, `findOne`
   - Media Library: `upload`, `delete`
4. Assign role to users

---

## Troubleshooting

### "Forbidden" Error on API Call
**Cause:** Permissions not enabled  
**Fix:** Check Public role has `find`/`findOne` enabled

### CORS Error in Frontend
**Cause:** Origin not whitelisted  
**Fix:** Add domain to `CORS_ORIGIN` in `.env`

### 401 Unauthorized
**Cause:** Token required but not provided  
**Fix:** Add `Authorization: Bearer TOKEN` header

### Empty Response
**Cause:** No published content  
**Fix:** Ensure articles are **Published**, not **Draft**

---

## Production Checklist

Before deploying to production:

- [ ] Public role has ONLY read permissions
- [ ] API tokens are secure and rotated
- [ ] CORS configured with specific domains
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Database backups automated
- [ ] Content moderation workflow in place
- [ ] Admin panel password is strong
- [ ] Audit logs enabled

---

## API Response Format

### Article Response
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "My First Article",
        "slug": "my-first-article",
        "excerpt": "Short description...",
        "content": "<p>Full content...</p>",
        "metaTitle": "SEO Title",
        "metaDescription": "SEO description",
        "keywords": "keyword1, keyword2",
        "publishedAt": "2025-01-01T00:00:00.000Z",
        "author": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "John Doe",
              "bio": "Author bio...",
              "twitter": "johndoe"
            }
          }
        },
        "category": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Technology",
              "slug": "technology",
              "color": "#3B82F6"
            }
          }
        },
        "tags": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "name": "AI",
                "slug": "ai"
              }
            }
          ]
        }
      }
    }
  ]
}
```

---

## Advanced: Custom Permissions

For fine-grained control, use lifecycle hooks in `src/api/article/controllers/article.js`:

```javascript
module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  async find(ctx) {
    // Only return published articles to public
    ctx.query.filters = {
      ...ctx.query.filters,
      publishedAt: { $notNull: true }
    };
    return await super.find(ctx);
  }
}));
```

---

**Security First, Performance Always**  
*embracingearth.space - Enterprise-grade permissions architecture*
