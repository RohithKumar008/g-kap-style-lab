# 📋 Quick Reference Card

## 🎯 Right Now

Your frontend is running! Backend is waiting for Supabase credentials.

```
Frontend: http://localhost:8080 ✅
Backend:  http://localhost:3001 ⏳ (waiting for Supabase)
```

---

## ⚡ 3-Minute Setup

```bash
# Step 1: Get credentials from https://supabase.com
# New Project → Copy URL + API Key

# Step 2: Update .env file
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key

# Step 3: Restart backend
npm run server

# Done! ✅
```

---

## 📁 Important Files

| File | What It Does |
|------|-------------|
| `.env` | Backend secrets (Supabase credentials) |
| `.env.local` | Frontend secrets (same credentials) |
| `supabase-schema.sql` | Database schema (run in Supabase) |
| `SETUP.md` | Full detailed guide |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step checklist |

---

## 🚀 Commands

```bash
npm run dev          # Frontend only
npm run server       # Backend only  
npm run dev:all      # Both (recommended)
npm run build        # Production build
```

---

## 🔑 Supabase Quick Links

- Dashboard: https://app.supabase.com
- SQL Editor: New Query → paste `supabase-schema.sql` → Run
- Storage: Create 2 buckets: `product-images`, `user-designs`
- Settings → API: Copy Project URL & anon key

---

## ✨ What's Included

✅ React Frontend + TypeScript
✅ Express Backend + TypeScript  
✅ PostgreSQL Database (Supabase)
✅ User Authentication
✅ Shopping Cart
✅ Custom T-Shirt Designer
✅ File Upload
✅ Admin Panel Ready

---

## 🧪 Quick Tests

1. **Backend health:**
   ```
   curl http://localhost:3001/health
   ```

2. **Sign up:**
   - Go to http://localhost:8080
   - Click Sign Up
   - Create account

3. **Add product:**
   - Supabase → Table Editor → products → Insert Row

---

## 📞 Need Help?

See: [SETUP.md](SETUP.md) → Section "Troubleshooting"

---

## 🎉 You're Ready!

Next step: Set up Supabase (5 minutes)
Then: Add your first product (2 minutes)
Result: **Live e-commerce store!** 🚀
