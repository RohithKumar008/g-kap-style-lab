# Instagram Feed Setup Guide

This guide will help you integrate real Instagram posts into your G-KAP website using the Instagram Basic Display API.

## Prerequisites

- An Instagram account (preferably a business/creator account)
- A Facebook Developer account
- Your Instagram posts must be public

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** in the top right
3. Click **"Create App"**
4. Choose **"Consumer"** as the app type
5. Fill in your app details:
   - App Name: `G-KAP Instagram Feed`
   - App Contact Email: `gkapprints@gmail.com`
6. Click **"Create App"**

## Step 2: Add Instagram Basic Display

1. In your app dashboard, scroll down to **"Add a Product"**
2. Find **"Instagram Basic Display"** and click **"Set Up"**
3. Click **"Create New App"** in the Instagram Basic Display section
4. Accept the terms and click **"Create App"**

## Step 3: Configure Instagram Basic Display

1. Under **Basic Display**, scroll to **"User Token Generator"**
2. Click **"Add or Remove Instagram Testers"**
3. Click **"Add Instagram Testers"** and enter your Instagram username
4. Save changes

## Step 4: Accept Tester Invitation

1. Log in to your Instagram account
2. Go to Settings → Apps and Websites → Tester Invites
3. Accept the invitation from your Facebook app

## Step 5: Generate Access Token

1. Back in the Facebook Developer dashboard
2. Go to **Instagram Basic Display** → **Basic Display**
3. Scroll to **"User Token Generator"**
4. Click **"Generate Token"** next to your Instagram account
5. Click **"Continue"** when prompted
6. Click **"Authorize"** to allow access
7. Copy the **Access Token** that appears

## Step 6: Add Token to Your Project

1. Create a `.env` file in your project root (if it doesn't exist):
   ```bash
   cp .env.example .env
   ```

2. Add your Instagram access token to `.env`:
   ```env
   VITE_INSTAGRAM_ACCESS_TOKEN=your_access_token_here
   ```

3. **Important**: Never commit your `.env` file to Git. It should already be in `.gitignore`.

## Step 7: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the About page: `http://localhost:5173/about`

3. You should see your real Instagram posts in the carousel!

## Troubleshooting

### "Instagram access token not found"
- Make sure you've added `VITE_INSTAGRAM_ACCESS_TOKEN` to your `.env` file
- Restart your development server after adding environment variables

### "Failed to fetch Instagram posts"
- Verify your access token is correct
- Check that your Instagram account is a tester for your Facebook app
- Ensure your Instagram posts are public

### Token Expiration
Access tokens expire after **60 days**. To prevent this:

1. Use the long-lived token exchange:
   - In your Facebook app, go to **Instagram Basic Display** → **Basic Display**
   - Under **"Long-Lived Access Tokens"**, click **"Generate Token"**
   
2. Or implement token refresh in your app (already set up in `src/services/instagram.ts`)

## API Limits

- Instagram Basic Display API has rate limits
- Default: 200 API calls per user per hour
- For production, consider caching responses

## Production Deployment

Before deploying to production:

1. **Add your access token** to your hosting platform's environment variables:
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Build & deploy → Environment
   - Others: Check your platform's documentation

2. **Set up token refresh** to avoid manual updates every 60 days

3. **Monitor API usage** in the Facebook Developer dashboard

## Additional Resources

- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook Developer Console](https://developers.facebook.com/apps/)
- [Instagram API Testing Guide](https://developers.facebook.com/docs/instagram-basic-display-api/overview#testing)

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify your access token in the Facebook Developer dashboard
3. Ensure your Instagram account is properly linked as a tester
4. Check that you're using a Business or Creator Instagram account

---

**Note**: For a production-ready solution with automatic token refresh, consider:
- Setting up a backend service to manage token refresh
- Using Instagram Graph API (requires Business account)
- Implementing a cron job to refresh tokens automatically
