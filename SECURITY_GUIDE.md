# 🔐 Security Guide for Self-Hosted Strapi

**Enterprise-grade security for self-hosted Strapi on Fly.io**  
*Built with embracingearth.space architecture for 100k+ concurrent users*

---

## ✅ Is Self-Hosted Strapi Secure?

**YES!** Self-hosted Strapi is as secure as Strapi Cloud (or more, since you control everything).

### Security Comparison

| Feature | Self-Hosted | Strapi Cloud |
|---------|-------------|--------------|
| **HTTPS/SSL** | ✅ Yes (Fly.io auto) | ✅ Yes |
| **JWT Authentication** | ✅ Yes | ✅ Yes |
| **Password Hashing** | ✅ bcrypt | ✅ bcrypt |
| **API Security** | ✅ Full control | ✅ Managed |
| **Database Encryption** | ✅ Your choice | ✅ Managed |
| **Access Control** | ✅ Full control | ✅ Managed |

**Bottom line**: Self-hosted is just as secure, with more control!

---

## 🔒 Authentication Security

### How Sign-In Works

Strapi uses **industry-standard JWT (JSON Web Tokens)** for authentication:

1. **User logs in** → Strapi validates credentials
2. **Password checked** → Hashed with bcrypt (one-way encryption)
3. **JWT token issued** → Signed with `JWT_SECRET` (your secret key)
4. **Token sent to client** → Stored securely (not in localStorage for production)
5. **Subsequent requests** → Token validated on each request

### Security Features

✅ **Password Hashing**: bcrypt with salt (industry standard)  
✅ **JWT Tokens**: Signed and encrypted  
✅ **Token Expiration**: Configurable expiration times  
✅ **HTTPS Only**: All traffic encrypted in transit  
✅ **CORS Protection**: Only allowed origins can access  
✅ **Rate Limiting**: Prevents brute force attacks  
✅ **Session Management**: Secure session handling  

### Admin Panel Security

**Access**: `https://your-app.fly.dev/admin`

- ✅ **HTTPS enforced** (Fly.io auto-configures)
- ✅ **Strong password required** (you set it)
- ✅ **JWT authentication** (secure token-based)
- ✅ **IP restrictions** (optional, can configure)
- ✅ **2FA support** (via plugins, if needed)

---

## 🛡️ Security Checklist

### 1. Environment Variables (CRITICAL)

**Generate strong secrets:**

```bash
# Generate 5 different secure keys
openssl rand -base64 32  # Run 5 times

# Set in Fly.io
fly secrets set \
  APP_KEYS="<key1>,<key2>" \
  API_TOKEN_SALT="<salt1>" \
  ADMIN_JWT_SECRET="<secret1>" \
  TRANSFER_TOKEN_SALT="<salt2>" \
  JWT_SECRET="<secret2>"
```

**Why**: These encrypt sessions, tokens, and data. Weak keys = security risk!

### 2. Database Security

✅ **Use PostgreSQL** (not SQLite for production)  
✅ **Enable SSL** (`sslmode=require`)  
✅ **Strong passwords** (20+ characters, random)  
✅ **Separate credentials** (different user/pass for each app)  
✅ **Regular backups** (encrypted backups)  

### 3. API Security

**Public Role (Read-Only):**
```javascript
// Only enable these for Public role:
- find    ✅ (list content)
- findOne ✅ (get single item)
- create  ❌ (disabled)
- update  ❌ (disabled)
- delete  ❌ (disabled)
```

**API Tokens (Write Access):**
- ✅ Use API tokens for write operations
- ✅ Set expiration dates
- ✅ Rotate tokens regularly
- ✅ Use different tokens for dev/prod

### 4. CORS Configuration

**Restrict to specific domains:**

```bash
fly secrets set CORS_ORIGIN="https://yourdomain.com,https://www.yourdomain.com"
```

**Never use:**
```bash
CORS_ORIGIN="*"  # ❌ Allows any website to access your API
```

### 5. HTTPS/SSL

✅ **Automatic with Fly.io** - All traffic encrypted  
✅ **SSL certificates** - Auto-renewed by Fly.io  
✅ **HTTP redirects to HTTPS** - Configured in `fly.toml`  

### 6. Admin Panel Security

**Best Practices:**
- ✅ Use strong admin password (20+ chars, mixed case, numbers, symbols)
- ✅ Change default admin email
- ✅ Enable 2FA (if available via plugins)
- ✅ Limit admin access to specific IPs (optional)
- ✅ Rotate admin password regularly
- ✅ Use separate admin accounts (not shared)

### 7. File Upload Security

**Configure upload limits:**

```javascript
// config/plugins.js (if needed)
module.exports = {
  upload: {
    config: {
      sizeLimit: 10 * 1024 * 1024, // 10MB max
    },
  },
};
```

**File type restrictions:**
- ✅ Only allow safe file types (images, PDFs)
- ✅ Scan uploads for malware (optional)
- ✅ Store uploads in secure location (S3, etc.)

---

## 🔐 Security Headers

Your `config/middlewares.js` includes security headers:

```javascript
{
  name: 'strapi::security',
  config: {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'connect-src': ["'self'", 'https:'],
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        // ... more security directives
      },
    },
  },
}
```

**What this does:**
- ✅ Prevents XSS attacks
- ✅ Controls resource loading
- ✅ Enforces HTTPS
- ✅ Blocks malicious scripts

---

## 🚨 Common Security Risks & Fixes

### Risk 1: Weak Secrets

**Problem**: Using default or weak `APP_KEYS`, `JWT_SECRET`, etc.

**Fix:**
```bash
# Generate strong secrets
openssl rand -base64 32

# Set in Fly.io secrets
fly secrets set APP_KEYS="<strong-key-1>,<strong-key-2>"
```

### Risk 2: Public API Write Access

**Problem**: Enabling `create`, `update`, `delete` for Public role

**Fix:**
- Only enable `find` and `findOne` for Public role
- Use API tokens for write operations

### Risk 3: CORS Too Permissive

**Problem**: `CORS_ORIGIN="*"` allows any website to access your API

**Fix:**
```bash
fly secrets set CORS_ORIGIN="https://yourdomain.com,https://www.yourdomain.com"
```

### Risk 4: Database Exposed

**Problem**: Database accessible from internet without SSL

**Fix:**
- Use `sslmode=require` in connection string
- Keep database credentials in Fly.io secrets
- Use strong database passwords

### Risk 5: Admin Password Weak

**Problem**: Using simple admin password

**Fix:**
- Use password manager to generate strong password
- 20+ characters, mixed case, numbers, symbols
- Rotate regularly

---

## 🔍 Security Monitoring

### Check Logs Regularly

```bash
# View access logs
fly logs

# Look for:
# - Failed login attempts
# - Unauthorized API calls
# - Database connection errors
```

### Monitor for Suspicious Activity

- Multiple failed login attempts
- Unusual API usage patterns
- Unexpected database queries
- High error rates

### Set Up Alerts

```bash
# Fly.io metrics
fly metrics

# Set up external monitoring:
# - UptimeRobot (free)
# - Sentry (error tracking)
# - Logtail (log aggregation)
```

---

## 🛠️ Advanced Security (Optional)

### 1. IP Whitelisting (Admin Panel)

Restrict admin access to specific IPs:

```javascript
// config/admin.js
module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  // Add IP restrictions via middleware
});
```

### 2. Rate Limiting

Prevent brute force attacks:

```javascript
// config/middlewares.js
{
  name: 'strapi::rateLimit',
  config: {
    interval: 60000, // 1 minute
    timeWait: 30000, // 30 seconds
    max: 5, // 5 requests per interval
  },
}
```

### 3. 2FA (Two-Factor Authentication)

Install 2FA plugin (if available):
- Search Strapi marketplace for 2FA plugins
- Configure for admin users
- Require 2FA for sensitive operations

### 4. Audit Logging

Track all admin actions:
- User logins
- Content changes
- Permission changes
- API token creation

---

## ✅ Security Checklist

Before going to production:

- [ ] Strong `APP_KEYS` generated and set
- [ ] Strong `JWT_SECRET` and `ADMIN_JWT_SECRET` set
- [ ] Strong database password set
- [ ] Database SSL enabled (`sslmode=require`)
- [ ] CORS restricted to specific domains
- [ ] Public role only has `find` and `findOne`
- [ ] API tokens created with expiration dates
- [ ] Strong admin password set
- [ ] HTTPS enforced (automatic with Fly.io)
- [ ] Security headers configured
- [ ] File upload limits set
- [ ] Regular backups configured
- [ ] Monitoring/alerting set up
- [ ] Secrets stored in Fly.io (not in code)

---

## 📚 Security Resources

- **Strapi Security**: [docs.strapi.io/dev-docs/security](https://docs.strapi.io/dev-docs/security)
- **OWASP Top 10**: [owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten)
- **JWT Best Practices**: [jwt.io/introduction](https://jwt.io/introduction)
- **Fly.io Security**: [fly.io/docs/security](https://fly.io/docs/security)

---

## 🎯 Summary

**Is self-hosted Strapi secure?**

✅ **YES!** Self-hosted Strapi is as secure as Strapi Cloud when properly configured.

**Key security features:**
- ✅ JWT authentication (industry standard)
- ✅ Password hashing (bcrypt)
- ✅ HTTPS/SSL (automatic with Fly.io)
- ✅ CORS protection
- ✅ Security headers
- ✅ Database encryption
- ✅ API token system

**You control:**
- Security keys and secrets
- Database security
- Access controls
- Monitoring and logging

**Bottom line**: Self-hosted = same security, more control!

---

*Built with embracingearth.space architecture*  
*Enterprise-grade security for 100k+ concurrent users*
