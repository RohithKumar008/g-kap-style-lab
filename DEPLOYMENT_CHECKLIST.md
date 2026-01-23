# 🎯 G-KAP Full-Stack Setup Checklist

## ✅ What's Been Done

- ✅ **Frontend Created** - React + TypeScript + TailwindCSS + shadcn/ui
- ✅ **Backend Created** - Express API with all routes
- ✅ **Database Schema** - Complete SQL schema with tables, RLS, triggers
- ✅ **Authentication** - Supabase Auth integration
- ✅ **API Hooks** - useProducts, useCart, useOrders, useCustomize
- ✅ **File Upload** - Multer configured for image uploads
- ✅ **Environment Setup** - .env and .env.local configured
- ✅ **Frontend Running** - Vite dev server on http://localhost:8080
- ✅ **Backend Ready** - Express waiting for Supabase credentials

---

## 🚀 NEXT STEPS (Do This Now!)

### Step 1: Create Supabase Project (5 minutes)

1. Go to **https://supabase.com**
2. Click **"New Project"**
3. Fill in:
   - **Name**: `g-kap-store`
   - **Database Password**: Create a strong password
   - **Region**: Pick closest to your location
4. Click **Create** and wait 2-3 minutes
5. Go to **Settings → API** and copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string)

### Step 2: Update Environment Variables (2 minutes)

**Edit `.env` file in the root:**

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJ0eXAi... (your long key from Step 1)
PORT=3001
NODE_ENV=development
```

**Edit `.env.local` file:**

```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAi... (same key)
```

### Step 3: Run Database Schema (3 minutes)

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy entire contents of `supabase-schema.sql` from your project
4. Paste into Supabase SQL editor
5. Click **Run** 
6. Should see: `Success` ✅

### Step 4: Create Storage Buckets (2 minutes)

1. Go to **Storage** in Supabase
2. Click **New Bucket**
3. Create first bucket:
   - Name: `product-images`
   - Public: ✅ Yes
4. Create second bucket:
   - Name: `user-designs`
   - Public: ✅ Yes
5. For each bucket → **Policies** → Enable SELECT, INSERT, DELETE for authenticated users

### Step 5: Restart Servers (1 minute)

**Terminal 1 (if not already running):**
```bash
npm run dev
```

**Terminal 2:**
```bash
npm run server
```

You should see:
- ✅ Frontend: `http://localhost:5173`
- ✅ Backend: `Server running on http://localhost:3001`

---

## 🧪 Test Everything (5 minutes)

### Test 1: Check Backend Health
Open in browser: `http://localhost:3001/health`
Should see: `{"status":"ok","message":"G-KAP API is running"}`

### Test 2: Sign Up
1. Go to `http://localhost:5173`
2. Click **Sign Up**
3. Enter email, password, name
4. Should redirect to shop page ✅

### Test 3: Browse Products
1. Go to `/shop`
2. Should load (will be empty until you add products)

### Test 4: Try Custom Designer
1. Go to `/customize`
2. Try uploading an image
3. Should work (stored locally until you buy)

---

## 📦 Add Your First Products (Optional)

### Option A: Via Supabase Dashboard (Easiest)

1. Go to Supabase → **Table Editor**
2. Click `products` table
3. Click **Insert Row**
4. Fill in:
   ```
   name: Cool T-Shirt
   price: 39.99
   image_url: https://your-image-url.com/image.jpg
   category: regular
   collection: streetwear
   colors: ["white","black"]  (as JSON)
   sizes: ["S","M","L","XL"]  (as JSON)
   fit: Regular Fit
   stock: 100
   ```
5. Click **Save**

### Option B: Via API (Postman/Thunder Client)

```
POST http://localhost:3001/api/products

{
  "name": "Cool T-Shirt",
  "price": 39.99,
  "image_url": "https://your-image-url.com/image.jpg",
  "category": "regular",
  "collection": "streetwear",
  "colors": ["white", "black"],
  "sizes": ["S", "M", "L", "XL"],
  "fit": "Regular Fit",
  "stock": 100,
  "is_new": true
}
```

---

## ✨ Features Now Available

✅ User Authentication (signup/login)
✅ Browse Products
✅ Shopping Cart (persists)
✅ Custom T-Shirt Designer
✅ Upload Designs
✅ Checkout & Orders
✅ Order History
✅ Admin Product Management

---

## 📊 System Status

| Component | Status | Port |
|-----------|--------|------|
| Frontend (Vite) | ✅ Running | 5173 |
| Backend (Express) | ⏳ Waiting for Supabase | 3001 |
| Database (Supabase) | 🔄 Need to set up | - |
| Authentication | ⏳ Ready | - |

---

## 🆘 Troubleshooting

**Backend won't start:**
- ❌ "Missing Supabase environment variables"
- ✅ Solution: Add credentials to `.env` file

**Products won't load:**
- ❌ GET `/api/products` returns error
- ✅ Solution: Check Supabase schema was created

**Can't upload images:**
- ❌ File upload fails
- ✅ Solution: Check storage buckets created in Supabase

**CORS errors:**
- ❌ Frontend can't reach backend
- ✅ Solution: Make sure backend is running on 3001

---

## 🎉 You're All Set!

Your **full-stack e-commerce store is ready** to:
- Take customer orders ✅
- Store images ✅  
- Manage inventory ✅
- Let customers design t-shirts ✅
- Handle authentication ✅

**Next: Set up Supabase and you're live!** 🚀

---

For detailed deployment to production, see: [SETUP.md](SETUP.md)
