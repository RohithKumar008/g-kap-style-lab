# G-KAP E-Commerce Store 🛍️

A modern, full-stack e-commerce platform for a clothing business built with React, TypeScript, Express, and Supabase.

## 🌟 Features

### Frontend
- ✅ **Modern UI** with shadcn/ui components
- ✅ **Responsive Design** for all devices
- ✅ **Product Catalog** with filtering and sorting
- ✅ **Shopping Cart** with persistent storage
- ✅ **Custom T-Shirt Designer** - Upload designs and customize
- ✅ **Authentication** - Sign up, login, logout
- ✅ **Order Management** - Track purchases
- ✅ **Beautiful Animations** with Framer Motion

### Backend
- ✅ **RESTful API** built with Express.js
- ✅ **PostgreSQL Database** via Supabase
- ✅ **JWT Authentication**
- ✅ **File Upload** support for custom designs
- ✅ **Row Level Security** for data protection
- ✅ **Automatic Order Numbers**

### Database
- ✅ **Products** - Store all merchandise
- ✅ **Users** - Customer accounts (Supabase Auth)
- ✅ **Cart** - Persistent shopping carts
- ✅ **Orders** - Complete order history
- ✅ **Custom Designs** - User-uploaded t-shirt designs
- ✅ **Storage Buckets** - Product images & user designs

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

📖 **See [SETUP.md](SETUP.md) for complete instructions** on:
- Creating a Supabase project
- Running the database schema
- Setting up storage buckets
- Getting your credentials

### 3. Configure Environment

Create `.env` in the root:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
PORT=3001
```

Create `.env.local`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run the Application

```bash
# Run both frontend and backend together
npm run dev:all

# Or run separately:
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

Visit `http://localhost:5173` 🎉

## 📁 Project Structure

```
g-kap-style-lab/
├── server/                 # Backend Express API
│   ├── config/            # Database config
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes (auth, products, cart, orders, customize)
│   └── index.ts           # Server entry
├── src/                   # Frontend React app
│   ├── components/        # UI components
│   ├── contexts/          # Auth context
│   ├── hooks/             # Custom hooks & API services
│   ├── pages/             # Route pages
│   ├── config/            # Frontend config
│   └── App.tsx            # App entry
├── supabase-schema.sql    # Database schema
├── SETUP.md               # Detailed setup guide
└── package.json
```

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Vite, TailwindCSS, shadcn/ui, Tanstack Query, Framer Motion

**Backend:** Node.js, Express, TypeScript, Supabase, Multer

## 📡 Key API Endpoints

- **Auth**: `/api/auth/signup`, `/api/auth/signin`, `/api/auth/signout`
- **Products**: `/api/products`, `/api/products/:id`
- **Cart**: `/api/cart` (protected)
- **Orders**: `/api/orders` (protected)
- **Custom Designs**: `/api/customize` (protected)

## 🎨 Business Features

- Product management with unlimited products
- Customer accounts & authentication
- Persistent shopping cart
- Order history & tracking
- **Custom t-shirt designer** - customers upload designs
- Inventory tracking
- Size & color variants

## 🔐 Security

✅ JWT authentication, Row Level Security, Secure file uploads, Environment variables, SQL injection protection

## 🚀 Deployment

See [SETUP.md](SETUP.md) for deployment to Vercel (frontend) and Render/Railway (backend).

## 🔧 Scripts

```bash
npm run dev          # Frontend only
npm run server       # Backend only
npm run dev:all      # Both (recommended)
npm run build        # Production build
```

---

Built with ❤️ for G-KAP Clothing
npm run server
```

Visit `http://localhost:5173` 🎉

## 📁 Project Structure
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
