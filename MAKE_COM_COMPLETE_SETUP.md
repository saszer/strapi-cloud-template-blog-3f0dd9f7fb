# 🚀 Make.com Complete Setup Guide - Step by Step

## 📋 Overview

This guide will walk you through setting up automated social media posting from Strapi using Make.com. The flow will be:

**Strapi Article Published** → **Make.com Webhook** → **Process Data** → **Post to 4 Social Platforms**

---

## 🎯 Part 1: Make.com Account Setup (5 minutes)

### Step 1: Create Make.com Account

1. **Go to**: https://www.make.com/en/register
2. **Sign up** with your email
3. **Verify email** (check your inbox)
4. **Login** to dashboard
5. **Choose plan**: Start with **FREE** (1,000 operations/month)

### Step 2: Create New Scenario

1. **Click**: "Create a new scenario" (big blue button)
2. **Name it**: "Strapi Blog Auto-Post"
3. **Click**: The big circle with **+** in the center
4. **Search**: "Webhooks"
5. **Select**: "Custom webhook"
6. **Click**: "Add"

---

## 🔗 Part 2: Webhook Configuration (5 minutes)

### Step 3: Configure Webhook

1. **Webhook name**: `Strapi Article Published`
2. **Click**: "Save"
3. **COPY the webhook URL** (looks like `https://hook.us1.make.com/xxxxx...`)
4. **Keep this tab open** - you'll need the URL!

### Step 4: Connect Strapi to Webhook

**In Strapi Admin Panel:**

1. **Go to**: Settings → Global Settings → Webhooks
2. **Click**: "Create new webhook"
3. **Configure**:
   - **Name**: `Make.com Auto-Post`
   - **Url**: Paste the Make.com webhook URL
   - **Headers**: Leave empty
   - **Events**: Check these:
     - ✅ `entry.publish` under **Article**
     - ✅ `entry.update` under **Article**
4. **Click**: "Save"

**Test the webhook:**
- In Strapi, edit any article and click "Publish"
- Go back to Make.com scenario
- You should see data appear (article details)
- If you see data, webhook is working! ✅

---

## 🛠️ Part 3: Build the Automation Flow (15 minutes)

### Step 5: Add Hashtag Processing

1. **Click**: **+** after the webhook module
2. **Search**: "Tools" → Select "Set variable"
3. **Configure**:
   - **Variable name**: `rawKeywords`
   - **Variable value**: `{{1.entry.keywords}}`
4. **Click**: "OK"

5. **Click**: **+** again
6. **Search**: "Tools" → Select "Set variable"
7. **Configure** (⚠️ **CRITICAL FOR PREVIEW CARDS**):

   **LinkedIn Preview Card Fix:**
   - **ONLY fill "Content" field** with your post text + URL
   - **LEAVE EMPTY**: Title, Description, Thumbnail, Link fields
   - **Why**: If you fill Title/Description, LinkedIn API assumes the post is complete and won't fetch Open Graph metadata to generate the preview card
   - **Result**: LinkedIn will auto-detect the URL, scrape your blog's Open Graph tags, and show the preview card ✅

   **Content Configuration**:
   - **Variable name**: `hashtags`
   - **Variable value**: `{{2.rawKeywords}}`
8. **Click**: "OK"

*Note: You'll manually configure hashtag processing in Make.com after import*

### Step 6: Add Base URL Generation

1. **Click**: **+** after the hashtags module
2. **Search**: "Tools" → Select "Set variable"
3. **Configure**:
   - **Variable name**: `baseUrl`
   - **Variable value**: `https://ai2fin.com/blog/{{1.entry.slug}}`
4. **Click**: "OK"

### Step 7: Add Router (Split to 4 Platforms)

1. **Click**: **+** after the base URL module
2. **Search**: "Flow control" → Select "Router"
3. **Click**: "OK"
4. **You'll see 4 routes** - we'll configure each one

---

## 📱 Part 4: Configure Social Media Platforms (20 minutes)

### Step 8: Configure Twitter Route

**Route 1 (Twitter):**

1. **Click**: **+** in the first route
2. **Search**: "Tools" → Select "Set variable"
3. **Configure**:
   - **Variable name**: `twitterUrl`
   - **Variable value**: `{{3.baseUrl}}?utm_source=twitter&utm_medium=social&utm_campaign=blog_auto_post&utm_content={{1.entry.slug}}`
4. **Click**: "OK"

5. **Click**: **+** after the Twitter URL module
6. **Search**: "Twitter" → Select "Create a Tweet"
7. **Click**: "Add a connection"
8. **Sign in** with your Twitter account
9. **Authorize** Make.com
10. **Configure**:
    - **Tweet text**: 
    ```
    {{1.entry.title}}

    {{1.entry.description}}

    {{1.entry.excerpt}}

    Read more: {{4.twitterUrl}}

    {{2.hashtags}}
    ```
11. **Click**: "OK"

### Step 9: Configure LinkedIn Route

**Route 2 (LinkedIn):**

1. **Click**: **+** in the second route
2. **Search**: "Tools" → Select "Set variable"
3. **Configure**:
   - **Variable name**: `linkedinUrl`
   - **Variable value**: `{{3.baseUrl}}?utm_source=linkedin&utm_medium=social&utm_campaign=blog_auto_post&utm_content={{1.entry.slug}}`
4. **Click**: "OK"

5. **Click**: **+** after the LinkedIn URL module
6. **Search**: "LinkedIn" → Select "Create a Share" or "Create a Text Post"
7. **Click**: "Add a connection"
8. **Sign in** with your LinkedIn account
9. **Authorize** Make.com

   **⚠️ CRITICAL FOR PREVIEW CARDS:**
   - **ONLY fill "Text" or "Content" field** with your post text + URL
   - **LEAVE EMPTY**: Title, Description, Thumbnail, Link fields
   - **Why**: If you fill Title/Description, LinkedIn API won't fetch Open Graph metadata
   - **Result**: LinkedIn auto-detects URL and shows preview card ✅

10. **Configure**:
    - **Text** (or **Content**): 
    ```
    📢 {{1.entry.title}}

    {{1.entry.description}}

    {{1.entry.excerpt}}

    Read the full article: {{5.linkedinUrl}}

    {{2.hashtags}}
    ```
    - **Visibility**: Public
11. **Click**: "OK"

### Step 10: Configure Facebook Route

**Route 3 (Facebook):**

1. **Click**: **+** in the third route
2. **Search**: "Tools" → Select "Set variable"
3. **Configure**:
   - **Variable name**: `facebookUrl`
   - **Variable value**: `{{3.baseUrl}}?utm_source=facebook&utm_medium=social&utm_campaign=blog_auto_post&utm_content={{1.entry.slug}}`
4. **Click**: "OK"

5. **Click**: **+** after the Facebook URL module
6. **Search**: "Facebook Pages" → Select "Create a Post"
7. **Click**: "Add a connection"
8. **Sign in** with your Facebook account
9. **Select your page**
10. **Authorize** Make.com

   **⚠️ CRITICAL - Avoid Facebook Error 100:**
   - **ONLY fill "Message" field** with your post text + URL
   - **LEAVE EMPTY**: Link, Picture, Name, Description, Caption fields
   - **Why**: Facebook only allows domain owners to specify these fields
   - **Error if filled**: "(#100) Only owners of the URL have the ability to specify the picture, name, thumbnail or description params"
   - **Result**: Facebook auto-detects URL and creates link preview ✅

11. **Configure**:
    - **Page**: Select your page
    - **Message**: 
    ```
    🚀 {{1.entry.title}}

    {{1.entry.description}}

    {{1.entry.excerpt}}

    Read more: {{6.facebookUrl}}

    {{2.hashtags}}
    ```
    - **Link**: ❌ **LEAVE EMPTY**
    - **Picture**: ❌ **LEAVE EMPTY**
    - **Name**: ❌ **LEAVE EMPTY**
    - **Description**: ❌ **LEAVE EMPTY**
12. **Click**: "OK"

### Step 11: Configure Instagram Route

**Route 4 (Instagram):**

1. **Click**: **+** in the fourth route
2. **Search**: "Tools" → Select "Set variable"
3. **Configure**:
   - **Variable name**: `instagramUrl`
   - **Variable value**: `{{3.baseUrl}}?utm_source=instagram&utm_medium=social&utm_campaign=blog_auto_post&utm_content={{1.entry.slug}}`
4. **Click**: "OK"

5. **Click**: **+** after the Instagram URL module
6. **Search**: "Instagram Business" → Select "Create a Photo Post"
7. **Click**: "Add a connection"
8. **Sign in** with your Instagram Business account
9. **Select your account**
10. **Authorize** Make.com
11. **Configure**:
    - **Account**: Select your Instagram account
    - **Image URL**: `{{1.entry.cover.url}}`
    - **Caption**: 
    ```
    {{1.entry.title}}

    {{1.entry.description}}

    {{1.entry.excerpt}}

    Link in bio 👆

    {{2.hashtags}}
    ```
12. **Click**: "OK"

---

## 🧪 Part 5: Test & Activate (10 minutes)

### Step 12: Test the Scenario

1. **Click**: "Run once" (top right)
2. **In Strapi**: Edit any article and click "Publish"
3. **Watch Make.com**: You should see the scenario run through all steps
4. **Check your social media**: Posts should appear on all platforms

### Step 13: Configure Hashtag Processing

**In Make.com, configure the hashtags module:**

1. **Click** on the "Process Hashtags" module
2. **Add Text Parser modules** (3 steps):
   - **Step 1**: Split by comma → `,` → `\n`
   - **Step 2**: Remove spaces → ` ` → `` (empty)
   - **Step 3**: Add hashtag prefix → `^(.+)$` → `#$1`

**Expected result:**
- **Input**: `"ai, keyword2, hello this is a sentence"`
- **Output**: `"#ai #keyword2 #hellothisisasentence"`

### Step 14: Activate the Scenario

1. **Click**: "Activate scenario" (top right)
2. **Confirm**: The scenario is now live
3. **Test**: Publish another article in Strapi
4. **Verify**: Posts appear on all social platforms

---

## 📊 Part 6: Monitor & Maintain (Ongoing)

### Step 15: Monitor Usage

1. **Check**: Make.com dashboard for operation usage
2. **Free tier**: 1,000 operations/month
3. **Your workflow**: ~8 operations per blog post
4. **Capacity**: ~125 blog posts/month on free tier

### Step 16: Troubleshooting

**Common issues:**

1. **Webhook not triggering**:
   - Check Strapi webhook configuration
   - Verify webhook URL is correct
   - Test with "Run once"

2. **Social posts failing**:
   - Check social media connections
   - Verify account permissions
   - Check post content length limits

3. **Hashtags not working**:
   - Configure Text Parser modules manually
   - Test with sample data

---

## 🎯 Complete Flow Summary

```
1. Strapi Article Published
   ↓
2. Make.com Webhook (receives data)
   ↓
3. Get Raw Keywords
   ↓
4. Process Hashtags (manual config needed)
   ↓
5. Generate Base URL
   ↓
6. Router (4 routes)
   ├─ Route 1: Twitter
   │  ├─ Generate Twitter UTM URL
   │  └─ Post to Twitter
   ├─ Route 2: LinkedIn
   │  ├─ Generate LinkedIn UTM URL
   │  └─ Post to LinkedIn
   ├─ Route 3: Facebook
   │  ├─ Generate Facebook UTM URL
   │  └─ Post to Facebook
   └─ Route 4: Instagram
      ├─ Generate Instagram UTM URL
      └─ Post to Instagram
```

---

## 💰 Cost Breakdown

- **Make.com Free**: 1,000 operations/month
- **Your workflow**: ~8 operations per post
- **Capacity**: ~125 posts/month
- **Upgrade**: $9/month for 10,000 operations (~1,250 posts/month)

---

## 🔐 Security Features

- ✅ **OAuth authentication** for all social platforms
- ✅ **No password storage** - all credentials managed by Make.com
- ✅ **Webhook security** - API key authentication available
- ✅ **Data encryption** - All data encrypted in transit

**Total setup time: ~1 hour**
**Monthly cost: FREE (up to 125 posts)**

---

**embracingearth.space - Enterprise-grade automation, securely** 🚀

