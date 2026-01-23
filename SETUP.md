# G-KAP Full-Stack E-Commerce - Setup Guide

## 🚀 Quick Start

Your website is now a **full-stack application** with authentication, database, and API! Follow these steps to get it running.

---

## 📋 Prerequisites

- Node.js (v18 or later)
- npm or bun
- A Supabase account (free tier is fine)

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `g-kap-store` (or your choice)
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to you
5. Wait 2-3 minutes for setup to complete

### Step 2: Run the Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql` from your project
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl/Cmd + Enter)
6. You should see "Success" - all tables are now created!

### Step 3: Set Up Storage Buckets

1. Go to **Storage** in Supabase sidebar
2. Click **New Bucket**
3. Create two buckets:

   **Bucket 1: Product Images**
   - Name: `product-images`
   - Public bucket: ✅ Yes
   - Click Create

   **Bucket 2: User Designs**
   - Name: `user-designs`
   - Public bucket: ✅ Yes
   - Click Create

4. For each bucket, go to **Policies** tab and add:
   - **SELECT policy**: Enable for everyone (public read)
   - **INSERT policy**: Enable for authenticated users only
   - **DELETE policy**: Enable for authenticated users only

### Step 4: Get Your Supabase Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** section
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## 🔧 Environment Configuration

### Step 1: Configure Backend

1. Open `.env` file in the project root
2. Add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
PORT=3001
NODE_ENV=development
```

### Step 2: Configure Frontend

1. Open `.env.local` file
2. Add the same credentials:

```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 📦 Install Dependencies

```bash
npm install
```

---

## 🏃‍♂️ Run the Application

### Option 1: Run Frontend and Backend Together (Recommended)

```bash
npm run dev:all
```

This starts:
- Frontend on `http://localhost:5173`
- Backend API on `http://localhost:3001`

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

---

## ✅ Verify Everything Works

1. Open `http://localhost:5173` in your browser
2. Click **Sign Up** to create an account
3. Check your email for verification (if email is configured in Supabase)
4. Try browsing products
5. Test adding items to cart
6. Try the customize feature

---

## 🎨 Adding Your First Products

### Option 1: Using Supabase Dashboard

1. Go to **Table Editor** in Supabase
2. Select `products` table
3. Click **Insert Row**
4. Fill in the fields:
   - `name`: Product name
   - `price`: 39.99
   - `image_url`: URL to product image
   - `category`: regular / oversized / premium
   - `collection`: anime / streetwear / minimal
   - `colors`: `["white", "black"]` (JSON array)
   - `sizes`: `["S", "M", "L", "XL"]` (JSON array)
   - `fit`: Regular Fit / Oversized
   - `stock`: 100
5. Click **Save**

### Option 2: Using API (Postman/Thunder Client)

**POST** `http://localhost:3001/api/products`

```json
{
  "name": "Cool T-Shirt",
  "description": "Amazing design",
  "price": 39.99,
  "image_url": "https://your-image-url.com/image.jpg",
  "category": "regular",
  "collection": "streetwear",
  "colors": ["white", "black", "gray"],
  "sizes": ["S", "M", "L", "XL"],
  "fit": "Regular Fit",
  "stock": 100,
  "is_new": true
}
```

---

## 🔐 Authentication Features

Your app now has:
- ✅ User signup with email verification
- ✅ Login/logout
- ✅ Protected routes (cart, checkout require auth)
- ✅ Session management
- ✅ Password reset (configure in Supabase)

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart (requires auth)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update quantity
- `DELETE /api/cart/:id` - Remove item
- `DELETE /api/cart` - Clear cart

### Orders (requires auth)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order

### Custom Designs (requires auth)
- `GET /api/customize` - Get user's designs
- `POST /api/customize` - Upload design (multipart/form-data)
- `GET /api/customize/:id` - Get single design
- `DELETE /api/customize/:id` - Delete design

---

## 🚀 Deployment

### Deploy Frontend (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your backend URL)
5. Deploy!

### Deploy Backend (Render/Railway)

**Using Render:**
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `tsx server/index.ts`
5. Add environment variables (from `.env`)
6. Deploy!

**Using Railway:**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy!

---

## 📊 Database Tables Created

- `products` - All your t-shirts and merchandise
- `cart_items` - User shopping carts (persisted)
- `orders` - Order history
- `order_items` - Items in each order
- `custom_designs` - User-uploaded custom t-shirt designs

---

## 🔒 Security Features

- ✅ Row Level Security (RLS) on all tables
- ✅ Users can only see their own cart/orders
- ✅ JWT token authentication
- ✅ Secure file uploads
- ✅ SQL injection protection

---

## 🎯 Next Steps

1. **Upload Product Images**: Add your t-shirt photos to `product-images` bucket
2. **Configure Email**: Set up email templates in Supabase for verification
3. **Add Payment**: Integrate Stripe for checkout
4. **Admin Dashboard**: Build admin panel to manage products
5. **Analytics**: Add Google Analytics or Plausible

---

## 🐛 Troubleshooting

**"No token provided" error:**
- Make sure you're logged in
- Check browser localStorage for `access_token`

**CORS errors:**
- Backend is running on port 3001
- Frontend expects API at `http://localhost:3001/api`

**Database errors:**
- Verify `.env` has correct Supabase credentials
- Check Supabase dashboard for errors
- Make sure RLS policies are enabled

**Products not showing:**
- Add products using Supabase dashboard
- Check `products` table has data
- Verify API is returning data: `http://localhost:3001/api/products`

---

## 📞 Support

If you need help:
1. Check Supabase logs (Logs section in dashboard)
2. Check browser console for errors
3. Check backend terminal for API errors
4. Verify all environment variables are set

---

**Your G-KAP store is now a complete full-stack application! 🎉**
