# 🚀 Quick Reference Guide

## Essential Commands

```bash
# Development
npm run dev:all      # Start everything (recommended)
npm run dev          # Frontend only (port 5173)
npm run server       # Backend only (port 3001)

# Production
npm run build        # Build frontend
npm run preview      # Preview production build
```

## 📍 URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/health

## 🔑 Environment Variables

**Backend (.env)**
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
PORT=3001
```

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## 📊 Database Tables

- `products` - Your t-shirts and merchandise
- `cart_items` - User shopping carts (persisted)
- `orders` - Order history
- `order_items` - Items in each order  
- `custom_designs` - User-uploaded designs

## 🗂️ Storage Buckets

- `product-images` - Your product photos
- `user-designs` - Customer uploaded designs

## 🔧 Where to Find Things

| What | Where |
|------|-------|
| Backend API routes | `server/routes/` |
| Frontend pages | `src/pages/` |
| API hooks | `src/hooks/useProducts.ts`, `useCart.ts`, etc. |
| Auth logic | `src/contexts/AuthContext.tsx` |
| Database schema | `supabase-schema.sql` |
| Setup instructions | `SETUP.md` |

## 🎯 Common Tasks

### Add a Product
1. Go to Supabase Dashboard → Table Editor → products
2. Click Insert Row
3. Fill in name, price, image_url, category, etc.
4. Save

### View Customer Designs
1. Go to Supabase Dashboard → Table Editor → custom_designs
2. See all uploaded designs with image URLs
3. Download images from Storage → user-designs

### Check Orders
1. Go to Supabase Dashboard → Table Editor → orders
2. View all orders with details
3. Join with order_items to see what was purchased

## 🐛 Troubleshooting

**Backend won't start?**
- Check `.env` has correct Supabase credentials
- Verify port 3001 is not in use

**Frontend can't connect?**
- Check `.env.local` has correct values
- Verify backend is running on port 3001
- Check VITE_API_URL is correct

**Database errors?**
- Run `supabase-schema.sql` in Supabase SQL Editor
- Check RLS policies are enabled
- Verify tables exist in Supabase

**Auth not working?**
- Check Supabase Auth is enabled
- Verify email settings in Supabase
- Check localStorage has `access_token`

## 📞 Need Help?

1. Check [SETUP.md](SETUP.md) for detailed instructions
2. Check browser console for errors (F12)
3. Check backend terminal for API errors
4. Check Supabase Logs in dashboard
5. Verify all environment variables are set

## 🎉 You're Ready!

Your full-stack e-commerce platform is complete and ready for business!
