# 📊 G-KAP Data Flow & Architecture

## 🔄 User Journey

```
┌──────────────────────────────────────────────────────────────────┐
│                      CUSTOMER JOURNEY                            │
└──────────────────────────────────────────────────────────────────┘

1. SIGNUP / LOGIN
   ├─ Visit /login
   ├─ Enter email + password
   ├─ Frontend sends to /api/auth/signup
   ├─ Supabase Auth validates & creates user
   ├─ Token returned & stored in localStorage
   └─ Redirected to /shop

2. BROWSE PRODUCTS
   ├─ Visit /shop
   ├─ Frontend calls GET /api/products
   ├─ Backend queries PostgreSQL
   ├─ Products displayed with images from Supabase Storage
   └─ User filters by category/collection

3. VIEW PRODUCT DETAILS
   ├─ Click product → /product/:id
   ├─ Frontend calls GET /api/products/:id
   ├─ Shows full details + reviews
   └─ Can select size, color, quantity

4. ADD TO CART
   ├─ Click "Add to Cart"
   ├─ Frontend sends POST /api/cart
   ├─ Backend creates cart_item in PostgreSQL
   ├─ Cart persists even if user closes browser
   └─ Cart count updates

5. CUSTOM DESIGNER (Optional)
   ├─ Visit /customize
   ├─ Upload image file
   ├─ Frontend sends FormData to POST /api/customize
   ├─ Backend receives file via Multer
   ├─ File uploaded to Supabase Storage
   ├─ URL + metadata saved to custom_designs table
   └─ Design saved to user account

6. CHECKOUT
   ├─ Visit /cart
   ├─ Review items
   ├─ Click "Checkout"
   ├─ Enter shipping address
   ├─ Select payment method
   ├─ Frontend calls POST /api/orders
   ├─ Backend creates order & order_items
   ├─ Cart is cleared
   └─ Confirmation page shown

7. ORDER TRACKING
   ├─ Customer account page
   ├─ Frontend calls GET /api/orders
   ├─ Shows all past orders with items
   └─ Can view design files they uploaded
```

---

## 📡 API Request/Response Flow

### Example: Add to Cart

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (React)                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User clicks "Add to Cart"                                      │
│         ↓                                                        │
│  useAddToCart() hook called                                     │
│         ↓                                                        │
│  axios.post('/cart', {                                          │
│    product_id: "123",                                           │
│    quantity: 2,                                                 │
│    selected_size: "M",                                          │
│    selected_color: "black"                                      │
│  })                                                              │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘
         │
         │ HTTP Request
         │ POST /api/cart
         │ Authorization: Bearer <token>
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND (Express)                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  POST /api/cart route handler                                   │
│         ↓                                                        │
│  authMiddleware checks JWT token                                │
│         ↓                                                        │
│  Extract req.user.id (user_id)                                 │
│         ↓                                                        │
│  Check if item already in cart                                 │
│         ├─ If yes: UPDATE quantity                             │
│         └─ If no: INSERT new cart_item                         │
│         ↓                                                        │
│  supabase.from('cart_items').insert({                          │
│    user_id: user_id,                                           │
│    product_id: "123",                                          │
│    quantity: 2,                                                │
│    selected_size: "M",                                         │
│    selected_color: "black"                                     │
│  })                                                              │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘
         │
         │ SQL Query
         │ INSERT INTO cart_items (...)
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ DATABASE (PostgreSQL / Supabase)                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  cart_items table                                               │
│  ┌────────────┬──────────┬────────────┬────────────────┐       │
│  │ id         │ user_id  │ product_id │ quantity       │       │
│  ├────────────┼──────────┼────────────┼────────────────┤       │
│  │ uuid-xyz   │ user-123 │ prod-456   │ 2              │ ← NEW │
│  └────────────┴──────────┴────────────┴────────────────┘       │
│                                                                   │
│  RLS Policy checks:                                             │
│  ✓ User can only see their own items                           │
│  ✓ Insertion succeeds                                          │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘
         │
         │ Return Result
         │ {id, user_id, product_id, quantity}
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND (Express) - Send Response                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  res.status(201).json(data)                                     │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘
         │
         │ HTTP Response
         │ 201 Created
         │ {id, user_id, product_id, ...}
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (React) - Handle Response                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Mutation succeeds                                              │
│         ↓                                                        │
│  queryClient.invalidateQueries(['cart'])                        │
│         ↓                                                        │
│  useCart() hook automatically refetches                         │
│         ↓                                                        │
│  Cart updated on screen ✨                                      │
│         ↓                                                        │
│  Toast notification: "Added to cart!"                           │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ SIGNUP                                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User fills form & clicks "Create Account"                      │
│  Frontend calls useAuth().signUp(email, password, name)         │
│         ↓                                                        │
│  supabase.auth.signUp() → Supabase Auth Service                │
│         ↓                                                        │
│  ✓ Password hashed & stored securely                           │
│  ✓ User record created                                         │
│  ✓ Verification email sent                                     │
│  ✓ Session token returned                                      │
│         ↓                                                        │
│  Frontend stores token in localStorage                          │
│  localStorage.setItem('access_token', token)                    │
│         ↓                                                        │
│  AuthContext updates: user = logged in                          │
│         ↓                                                        │
│  User redirected to /shop                                       │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ MAKING AUTHENTICATED REQUESTS                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Frontend: api.interceptors.request.use() middleware            │
│         ↓                                                        │
│  Before EVERY request:                                          │
│  - Get token from localStorage                                  │
│  - Add to Authorization header                                  │
│  - config.headers.Authorization = `Bearer ${token}`             │
│         ↓                                                        │
│  Example Request:                                               │
│  GET /api/cart                                                  │
│  Authorization: Bearer eyJhbGc...xyz                             │
│         ↓                                                        │
│  Backend: authMiddleware runs                                   │
│         ↓                                                        │
│  - Extract token from header                                    │
│  - Call supabase.auth.getUser(token)                           │
│  - Verify token is valid                                        │
│  - Extract user.id                                              │
│  - Add to req.user                                              │
│  - Call next() to proceed                                       │
│         ↓                                                        │
│  Route handler now has access to req.user.id                    │
│  Uses it to query only this user's data:                        │
│         ↓                                                        │
│  SELECT * FROM cart_items                                       │
│  WHERE user_id = req.user.id                                    │
│         ↓                                                        │
│  Only their cart returned ✓                                     │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ LOGOUT                                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User clicks "Logout"                                           │
│  Frontend calls useAuth().signOut()                             │
│         ↓                                                        │
│  supabase.auth.signOut()                                        │
│         ↓                                                        │
│  localStorage.removeItem('access_token')                        │
│         ↓                                                        │
│  AuthContext updates: user = null                               │
│         ↓                                                        │
│  User redirected to home                                        │
│  Protected routes no longer accessible                          │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 File Upload Flow (Custom Designs)

```
┌─────────────────────────────────────────────────────────────────┐
│ USER UPLOADS DESIGN IMAGE                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User in /customize page                                        │
│  Selects t-shirt type, color, size                              │
│  Uploads image file                                             │
│         ↓                                                        │
│  Frontend creates FormData:                                     │
│  {                                                              │
│    image: <File>,                                               │
│    tshirt_type: "oversized",                                    │
│    tshirt_color: "black",                                       │
│    size: "L",                                                   │
│    print_location: "front",                                     │
│    quantity: 5,                                                 │
│    image_scale: 1.2,                                            │
│    image_rotation: 15                                           │
│  }                                                               │
│         ↓                                                        │
│  Sends multipart POST /api/customize                            │
│  Authorization: Bearer <token>                                  │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘
         │
         │ HTTP Multipart Request
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND RECEIVES FILE                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Multer middleware parses upload                                │
│  - Validates file type (images only)                            │
│  - Stores in memory buffer                                      │
│  - req.file contains file data                                  │
│         ↓                                                        │
│  Generate unique filename:                                      │
│  fileName = `${userId}/uuid-filename.jpg`                       │
│         ↓                                                        │
│  supabase.storage                                               │
│    .from('user-designs')                                        │
│    .upload(fileName, file.buffer)                               │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘
         │
         │ Upload to Supabase Storage
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ SUPABASE STORAGE BUCKET: user-designs                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  File saved: /user-123/uuid-abc123.jpg                          │
│         ↓                                                        │
│  Get public URL:                                                │
│  https://xxxxx.supabase.co/storage/.../user-123/uuid-abc123.jpg │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘
         │
         │ URL returned to backend
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND SAVES TO DATABASE                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  INSERT INTO custom_designs                                     │
│  (user_id, image_url, tshirt_type, ..., status)                │
│  VALUES (                                                        │
│    'user-123',                                                  │
│    'https://xxxxx.../user-123/uuid-abc123.jpg',                │
│    'oversized',                                                 │
│    'black',                                                     │
│    'L',                                                         │
│    'front',                                                     │
│    5,                                                           │
│    1.2,                                                         │
│    15,                                                          │
│    'pending'                                                    │
│  )                                                               │
│         ↓                                                        │
│  RLS Policy checks:                                             │
│  ✓ User can only insert their own designs                      │
│  ✓ Design record created with ID                               │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘
         │
         │ Return design data
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND RECEIVES RESPONSE                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  {                                                               │
│    id: "design-xyz",                                            │
│    image_url: "https://xxxxx.../user-123/uuid-abc123.jpg",     │
│    status: "pending"                                            │
│  }                                                               │
│         ↓                                                        │
│  Design added to user's list ✨                                 │
│  Can view in "My Designs" section                               │
│  URL points to actual image in storage                          │
│         ↓                                                        │
│  User can:                                                      │
│  - Download design                                              │
│  - Convert to order                                             │
│  - Share with others                                            │
│  - Delete design                                                │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Security & Row Level Security (RLS)

```
┌─────────────────────────────────────────────────────────────────┐
│ ROW LEVEL SECURITY EXAMPLE                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Alice (user-111) and Bob (user-222)                            │
│  Both have items in cart_items table                            │
│                                                                   │
│  CART_ITEMS TABLE:                                              │
│  ┌──────────┬─────────┬────────────┬──────────┐                │
│  │ id       │ user_id │ product_id │ quantity │                │
│  ├──────────┼─────────┼────────────┼──────────┤                │
│  │ cart-1   │ user-111│ prod-123   │ 1        │ ← Alice's      │
│  │ cart-2   │ user-111│ prod-456   │ 2        │ ← Alice's      │
│  │ cart-3   │ user-222│ prod-789   │ 1        │ ← Bob's        │
│  │ cart-4   │ user-222│ prod-101   │ 3        │ ← Bob's        │
│  └──────────┴─────────┴────────────┴──────────┘                │
│                                                                   │
│  RLS POLICY:                                                     │
│  "Users can view their own cart items"                          │
│         ↓                                                        │
│  CREATE POLICY "view_own_cart"                                  │
│  ON cart_items FOR SELECT                                       │
│  USING (auth.uid() = user_id)                                   │
│         ↓                                                        │
│  When Alice queries:                                            │
│  SELECT * FROM cart_items                                       │
│  WHERE user_id = 'user-111'  ← RLS adds this automatically      │
│         ↓                                                        │
│  Result: Only cart-1 and cart-2 visible ✓                       │
│         ↓                                                        │
│  When Bob queries same table:                                   │
│  Same query, different user                                     │
│  WHERE user_id = 'user-222'  ← RLS filters automatically        │
│         ↓                                                        │
│  Result: Only cart-3 and cart-4 visible ✓                       │
│         ↓                                                        │
│  Alice CAN'T see Bob's items                                    │
│  Bob CAN'T see Alice's items                                    │
│  Admin can only see their own                                   │
│         ↓                                                        │
└─────────────────────────────────────────────────────────────────┘

POLICIES ON ALL TABLES:
✓ cart_items        - Users see only their own
✓ orders            - Users see only their own  
✓ order_items       - Via order ownership
✓ custom_designs    - Users see only their own
✓ products          - Public read (everyone sees)
```

---

## 🔄 Data Persistence

```
What persists even if user closes browser:

✅ Products                    → Database persists
✅ Shopping Cart               → Database persists (linked to user_id)
✅ User Accounts               → Database persists
✅ Orders & History            → Database persists
✅ Custom Designs & Images     → Storage + Database persist
✅ Login Token                 → localStorage (expires after period)

What does NOT persist:
❌ Temporary UI state
❌ Notifications/toasts
❌ Form drafts (unless saved)
❌ Session when logged out
```

---

## 📊 Data Types & Examples

### Product Record
```json
{
  "id": "prod-1",
  "name": "Geometric Motion Tee",
  "price": 39.99,
  "original_price": 49.99,
  "image_url": "https://storage.../product-images/tee-1.jpg",
  "category": "regular",
  "collection": "startup",
  "colors": ["white", "black", "gray"],
  "sizes": ["S", "M", "L", "XL"],
  "fit": "Regular Fit",
  "stock": 100,
  "is_new": true
}
```

### Cart Item Record
```json
{
  "id": "cart-item-1",
  "user_id": "user-123",
  "product_id": "prod-1",
  "quantity": 2,
  "selected_size": "M",
  "selected_color": "black",
  "created_at": "2024-01-23T20:30:00Z"
}
```

### Order Record
```json
{
  "id": "order-1",
  "order_number": "GK-ABC12345",
  "user_id": "user-123",
  "status": "pending",
  "subtotal": 79.98,
  "shipping_cost": 9.99,
  "tax": 7.20,
  "total": 97.17,
  "shipping_address": {
    "name": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "payment_method": "card",
  "created_at": "2024-01-23T20:35:00Z"
}
```

### Custom Design Record
```json
{
  "id": "design-1",
  "user_id": "user-123",
  "image_url": "https://storage.../user-designs/user-123/uuid-abc.jpg",
  "tshirt_type": "oversized",
  "tshirt_color": "black",
  "size": "L",
  "print_location": "front",
  "quantity": 5,
  "image_scale": 1.2,
  "image_rotation": 15,
  "status": "pending",
  "created_at": "2024-01-23T20:40:00Z"
}
```

---

This represents the complete data flow of your G-KAP e-commerce platform! 🚀
