# 📦 Make.com Blueprint Import Instructions

## 🎯 Quick Import (5 minutes)

Instead of manual setup, **import this pre-built blueprint** that includes hashtag generation and UTM tracking!

---

## 📋 Step 1: Import Blueprint

1. **Download blueprint file**: `make-com-blueprint.json`

2. **Login to Make.com**: https://www.make.com

3. **Create new scenario**:
   - Click **"Create a new scenario"**
   - Click **"..."** (three dots) in top right
   - Select **"Import Blueprint"**
   - Upload `make-com-blueprint.json`
   - Click **"Save"**

---

## 🔧 Step 2: Configure Connections (5 minutes)

### **2.1 Configure Webhook**

1. **Click on first module** (Webhook)
2. **Create webhook**:
   - Name: `Strapi Article Published`
   - **Enable API Key**: ✅ Yes
   - Generate API key (copy it!)
   - **Save**
3. **Copy webhook URL**

### **2.2 Configure Twitter**

1. **Click on Twitter module**
2. Click **"Create a connection"**
3. **Sign in with Twitter** (OAuth)
4. Authorize Make.com
5. Connection saved ✅

### **2.3 Configure LinkedIn**

1. **Click on LinkedIn module**
2. Click **"Create a connection"**
3. **Sign in with LinkedIn** (OAuth)
4. Authorize Make.com
5. Connection saved ✅

### **2.4 Configure Facebook** (Optional)

1. **Click on Facebook module**
2. Click **"Create a connection"**
3. **Sign in with Facebook** (OAuth)
4. **Select your page**
5. Connection saved ✅

### **2.5 Configure Instagram** (Optional)

1. **Click on Instagram module**
2. Click **"Create a connection"**
3. **Sign in with Instagram** (requires Facebook Business)
4. **Select your account**
5. Connection saved ✅

### **2.6 Test Hashtag Generation**

1. **Click on Text Parser module** (Module 2)
2. **Verify configuration**:
   - **Text**: `{{1.entry.keywords}}`
   - **Pattern**: `,\s*`
   - **Replace**: `#`
   - **Global match**: ✅ **Yes**

3. **Test with sample data**:
   - Input: `"test, automation, social media"`
   - Expected output: `"test#automation#social media"`

4. **Check Set Variable module** (Module 3):
   - **Variable name**: `hashtags`
   - **Variable value**: `#{{2.text}}`
   - **Expected final output**: `"#test#automation#social media"`

---

## 📊 Step 3: Configure Strapi Webhook

1. **Strapi Admin** → **Settings** → **Webhooks**
2. **Create new webhook**:
   - **Name**: `Make.com Auto-Post`
   - **Url**: [Paste webhook URL from Step 2.1]
   - **Headers**:
     - Key: `x-make-apikey`
     - Value: [API key from Step 2.1]
   - **Events**: 
     - ✅ `entry.publish` (Article)
     - ✅ `entry.update` (Article)
3. **Save**

---

## ✅ Step 4: Test & Activate

1. **Click "Run once"** in Make.com
2. **Publish test article** in Strapi with:
   - Title: "Test Article"
   - Keywords: "test, automation, social media"
   - Description: "Testing auto-post"
3. **Watch scenario run**
4. **Check output**:
   - Hashtags should be: `#test#automation#social media`
   - With leading #: `#test#automation#social media`
5. **Verify posts** on Twitter, LinkedIn, Facebook, Instagram
6. **If successful**: Click "Activate scenario" ✅

---

## 🎯 What the Blueprint Includes

### ✅ Complete Flow:
1. **Webhook** (receives Strapi data)
2. **Filter** (only first publish, not edits)
3. **Text Parser** (converts keywords to hashtags)
4. **Set Variable** (stores hashtags)
5. **Router** (splits to 4 platforms)
6. **Twitter Post** (with UTM + hashtags)
7. **LinkedIn Post** (with UTM + hashtags)
8. **Facebook Post** (with UTM + hashtags)
9. **Instagram Post** (with UTM + hashtags)
10. **Aggregator** (merges routes)
11. **HTTP Request** (marks article as shared in Strapi)

### ✅ UTM Tracking:
- Twitter: `?utm_source=twitter&utm_medium=social&utm_campaign=blog_auto_post`
- LinkedIn: `?utm_source=linkedin&utm_medium=social&utm_campaign=blog_auto_post`
- Facebook: `?utm_source=facebook&utm_medium=social&utm_campaign=blog_auto_post`
- Instagram: `?utm_source=instagram&utm_medium=social&utm_campaign=blog_auto_post`

### ✅ Hashtag Generation:
- **Method**: Official Make.com approach
- **Pattern**: `,\s*` → `#`
- **Leading hashtag**: Added via Set Variable
- **Result**: `#keyword1#keyword2#keyword3`

---

## 📝 Placeholders to Replace

After import, you need to configure these:

| Placeholder | Where to Get | Location in Blueprint |
|-------------|--------------|----------------------|
| `WEBHOOK_ID_PLACEHOLDER` | Auto-generated when you create webhook | Module 1 |
| `TWITTER_CONNECTION_PLACEHOLDER` | Connect Twitter account | Module 6 |
| `LINKEDIN_CONNECTION_PLACEHOLDER` | Connect LinkedIn account | Module 7 |
| `FACEBOOK_CONNECTION_PLACEHOLDER` | Connect Facebook account | Module 8 |
| `PAGE_ID_PLACEHOLDER` | Select your Facebook page | Module 8 |
| `INSTAGRAM_CONNECTION_PLACEHOLDER` | Connect Instagram account | Module 9 |
| `INSTAGRAM_ACCOUNT_ID_PLACEHOLDER` | Select your Instagram account | Module 9 |
| `YOUR_STRAPI_DOMAIN` | Your Strapi URL | Module 11 |
| `YOUR_STRAPI_API_TOKEN` | Strapi API token | Module 11 |

---

## 🔐 Security Features

✅ **Webhook API Key** authentication  
✅ **OAuth connections** for all social platforms  
✅ **No passwords** stored in blueprint  
✅ **Strapi API token** (you add after import)  

---

## 🎉 Benefits of Blueprint Import

- ⚡ **5 minutes** vs 30 minutes manual setup
- ✅ **Pre-configured** hashtag generation (official method)
- ✅ **Pre-configured** UTM tracking for all platforms
- ✅ **Pre-configured** filter logic (first publish only)
- ✅ **No configuration errors**
- ✅ **Tested flow logic**

---

## 🆘 Troubleshooting

### Issue: Import fails
- **Check**: Blueprint file is valid JSON
- **Try**: Copy/paste content into Make.com import dialog

### Issue: Modules show errors after import
- **Expected**: Connections need to be configured
- **Fix**: Follow Step 2 to configure each connection

### Issue: Hashtags not working
- **Check**: Strapi article has `keywords` field filled
- **Test**: Run scenario manually and inspect Text Parser output

---

## 📖 Alternative: Manual Setup

If blueprint import doesn't work, follow: `SOCIAL_AUTO_POST_SETUP.md`

---

**Import the blueprint and you're 90% done!** 🚀

