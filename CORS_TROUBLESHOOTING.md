# CORS Troubleshooting Guide

## Current Status
✅ CORS is properly configured in `server/index.js`
✅ Code has been pushed to GitHub
⏳ Waiting for Render to redeploy

## Allowed Origins
```javascript
'http://localhost:5173'
'http://localhost:3000'
'https://asij-fashons-client-hnqjd36f6-roni9843s-projects.vercel.app'
'https://asij-fashons-client.vercel.app'
```

## How to Check if Render Has Deployed

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Find your service**: ASIJ-FASHONS-backend
3. **Check deployment status**: Look for "Live" with the latest commit message
4. **Check logs**: Click on "Logs" to see if server started successfully

## Test CORS Manually

Open browser console on your Vercel site and run:
```javascript
fetch('https://asij-fashons-backend.onrender.com/api/auth/login', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://asij-fashons-client-hnqjd36f6-roni9843s-projects.vercel.app'
  }
}).then(r => console.log('CORS OK:', r.headers.get('access-control-allow-origin')))
```

## If Still Not Working

### Option 1: Temporarily Allow All Origins
In `server/index.js`, change line 31 to:
```javascript
callback(null, true); // This already allows all
```

### Option 2: Check Render Environment
Make sure Render has restarted. You can manually trigger a deploy:
1. Go to Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

### Option 3: Add More Vercel URLs
Vercel creates multiple URLs. Add all of them:
```javascript
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://asij-fashons-client-hnqjd36f6-roni9843s-projects.vercel.app',
    'https://asij-fashons-client.vercel.app',
    'https://asij-fashons-client-git-main-roni9843s-projects.vercel.app', // Git branch URL
];
```

## Current Configuration is Correct!
The CORS setup is already allowing all origins (line 31: `callback(null, true)`), so it should work once Render redeploys.

**Wait 2-3 minutes for Render to finish deploying, then try again!**
