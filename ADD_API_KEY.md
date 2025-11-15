# ⚡ IMPORTANT: Add Your Gemini API Key

## 🔑 Step 1: Get Your API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

## 📝 Step 2: Add to Backend .env File

Open `backend/.env` and add this line:

```env
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

Replace `YOUR_API_KEY_HERE` with your actual API key.

## ✅ Step 3: Verify

After adding the key, restart your backend server:

```bash
cd backend
npm run dev
```

You should see:
```
✅ Listening on port 4000
✅ MongoDB connected
✅ Socket.io server ready for live chat
```

## 🎯 Step 4: Test

1. Open http://localhost:5173
2. Login or create an account
3. Go to `/ai-tools`
4. Try the Live Chat feature
5. Type: "Hello, can you help me with coding?"

If you get a response, you're all set! 🎉

## 🚨 Troubleshooting

**Error: "GEMINI_API_KEY not found"**
- Make sure you added the key to `backend/.env`
- Restart the backend server
- Check that there are no spaces around the `=` sign

**Error: "API key invalid"**
- Verify you copied the entire key
- Generate a new key if needed
- Check for any extra spaces or quotes

## 🔒 Security Note

**NEVER commit the .env file or share your API key publicly!**

The `.env` file is already in `.gitignore` to keep your keys safe.

---

That's it! You're ready to use all 18 AI-powered developer tools! 🚀
