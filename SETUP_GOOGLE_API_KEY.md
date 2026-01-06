# 🔑 Setup Google Gemini API Key

## ⚠️ ISSUE FOUND

Your current setup is using the **example API key** from `.env.example`:
```
GOOGLE_API_KEY= your_api_key_here
```

This is **NOT a valid working key** - it's just a placeholder example.

## ✅ Solution: Get Your Own API Key

### Step 1: Create a New API Key

1. **Visit Google AI Studio:**
   - Go to: https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key:**
   - Click "Create API Key" button
   - Choose "Create API key in new project" or select existing project
   - Copy the generated key (starts with `AIzaSy...`)

### Step 2: Update Your `.env` File

1. **Open:** `backend/.env`

2. **Replace the example key with your new key:**
   ```env
   # AI API Keys
   # Google Gemini API (Primary)
   GOOGLE_API_KEY=AIzaSy[your-actual-key-here]
   ```

3. **Save the file**

### Step 3: Test the Connection

Run the test script:
```bash
.\test-api-connections.ps1
```

You should see:
```
✅ Google Gemini API:    ✅
```

## 📋 Current Configuration

Your `.env` should have these values:

```env
PORT=5000
NODE_ENV=development

# AI API Keys
GOOGLE_API_KEY=AIzaSy[your-new-key]  # ← UPDATE THIS

# Python Wisdom API
PYTHON_API_URL=http://localhost:8000

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Chat Logging
ENABLE_CHAT_LOGGING=false
```

## 🔒 Security Notes

- ✅ **DO**: Keep your API key in `backend/.env` (it's gitignored)
- ❌ **DON'T**: Commit API keys to version control
- ❌ **DON'T**: Share your API key publicly
- ❌ **DON'T**: Use the example key from `.env.example`

## 💰 Pricing Information

Gemini API has a **free tier**:
- **Free Tier**: 60 requests per minute
- **Cost**: $0 for most personal projects
- More info: https://ai.google.dev/pricing

## 🧪 API Models Available

After getting your key, you can use:
- `gemini-1.5-flash` - **Recommended** (Fastest, most efficient)
- `gemini-1.5-pro` - More capable, slower
- `gemini-pro` - Legacy model

Current configuration uses: **gemini-1.5-flash** ✅

## ❓ Troubleshooting

### Still getting 404 errors?
- Verify the key is correct (copy-paste carefully)
- Make sure there are no extra spaces in the `.env` file
- Restart your backend server after changing `.env`

### Getting 403 errors?
- API key may be restricted
- Check if Gemini API is enabled in your Google Cloud project

### Getting 429 errors?
- You've hit the rate limit
- Wait 60 seconds and try again
- Consider upgrading to paid tier if needed

## 🚀 Next Steps

After setting up your API key:

1. **Start Python API** (if not running):
   ```bash
   cd python-api
   python main.py
   ```

2. **Test both APIs:**
   ```bash
   .\test-api-connections.ps1
   ```

3. **Start your backend:**
   ```bash
   cd backend
   npm run dev
   ```

---
**Last Updated:** 2026-01-06
