# 🏷️ Auto Hashtag Generation from Keywords

## Overview

Automatically converts Strapi article keywords into hashtags for social media posts using Make.com Text Parser modules.

## How It Works

### Input (Strapi Article Keywords)
```
"intelligent financial management software, maximize tax deductions, AI bookkeeping, ATO-compliant reporting"
```

### Processing Steps

1. **Split by Comma** → Array of keywords
2. **Add # Prefix** → Array of hashtags  
3. **Join with Spaces** → Final hashtag string

### Output (Social Media Hashtags)
```
#intelligent financial management software #maximize tax deductions #AI bookkeeping #ATO-compliant reporting
```

## Make.com Setup

### Step 1: Text Parser - Split Keywords
- **Module**: Text Parser → Split Text
- **Text**: `{{1.keywords}}`
- **Delimiter**: `,`
- **Output**: Array of keywords

### Step 2: Text Parser - Format Hashtags
- **Module**: Text Parser → Replace Text
- **Text**: `{{previous.keywords}}`
- **Find**: `^(.+)$`
- **Replace**: `#{{$1.trim()}}`
- **Use Regular Expression**: ✅ Yes
- **Output**: Array of hashtags

### Step 3: Text Parser - Join Hashtags
- **Module**: Text Parser → Join Text
- **Text**: `{{previous.hashtags}}`
- **Delimiter**: ` ` (space)
- **Output**: `{{hashtags}}` (single string)

## Usage in Social Media Posts

### Twitter
```
{{1.title}}

{{1.description}}

Read more: {{twitterURL}}

{{hashtags}}
```

### LinkedIn
```
📢 {{1.title}}

{{1.description}}

Read the full article: {{linkedinURL}}

{{hashtags}}
```

### Facebook
```
🚀 {{1.title}}

{{1.description}}

Read more: {{facebookURL}}

{{hashtags}}
```

### Instagram
```
{{1.title}}

{{1.description}}

Link in bio 👆

{{hashtags}}
```

## Benefits

✅ **Automatic**: No manual hashtag creation  
✅ **Relevant**: Uses actual article keywords  
✅ **Consistent**: Same hashtags across all platforms  
✅ **SEO-Friendly**: Keywords become discoverable hashtags  
✅ **Time-Saving**: Zero manual work per post  

## Example Results

| Article Keywords | Generated Hashtags |
|------------------|-------------------|
| `"AI bookkeeping, tax deductions"` | `#AI bookkeeping #tax deductions` |
| `"financial management, ATO compliance"` | `#financial management #ATO compliance` |
| `"expense tracking, automation"` | `#expense tracking #automation` |

## Troubleshooting

### Issue: Hashtags not appearing
- **Check**: Text Parser modules are connected in sequence
- **Verify**: `{{hashtags}}` variable is available in social media modules
- **Test**: Run scenario manually to see hashtag output

### Issue: Extra spaces in hashtags
- **Fix**: Add `.trim()` in Replace Text module
- **Pattern**: `#{{$1.trim()}}`

### Issue: Keywords field empty
- **Check**: Strapi article has keywords filled
- **Verify**: Webhook is sending `keywords` field
- **Fallback**: Add default hashtags if keywords empty

## Advanced Customization

### Limit Hashtag Count
Add **Text Parser → Limit Items** after Split Text:
- **Items**: `{{previous.keywords}}`
- **Limit**: `5` (max 5 hashtags)

### Filter Out Common Words
Add **Text Parser → Filter** after Split Text:
- **Items**: `{{previous.keywords}}`
- **Condition**: `{{item}}` does not contain `"software"`

### Add Brand Hashtags
In Join Text module:
- **Text**: `{{previous.hashtags}}`
- **Delimiter**: ` `
- **Additional Text**: ` #AI2Fin #FinTech`

## Security Notes

- Keywords are processed client-side in Make.com
- No sensitive data exposed in hashtags
- All processing happens in secure Make.com environment
- Hashtags are public by nature (social media)

---

**Ready to implement?** Follow the main `SOCIAL_AUTO_POST_SETUP.md` guide with these hashtag modules added before social media posting.



