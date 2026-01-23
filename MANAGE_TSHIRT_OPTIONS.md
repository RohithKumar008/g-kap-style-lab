# Managing T-Shirt Types & Colors from Supabase

## 🎯 What Changed

The Customize page now loads t-shirt types and colors from **Supabase database** instead of hardcoded frontend data!

---

## 📊 Database Setup

### Step 1: Run the SQL Script

In your **Supabase SQL Editor**, run the file:
```
add-tshirt-types-table.sql
```

This creates:
- ✅ `tshirt_types` table - For t-shirt styles (Regular, Oversized, etc.)
- ✅ `tshirt_colors` table - For available colors
- ✅ Default data inserted automatically
- ✅ RLS policies enabled (public read access)

---

## 🛠️ Managing T-Shirt Types

### Via Supabase Dashboard (Easiest)

1. Go to **Supabase → Table Editor**
2. Click `tshirt_types` table
3. Click **Insert Row**

**Fields:**
- `type_id` - Unique identifier (e.g., "regular", "oversized")
- `name` - Display name (e.g., "Regular Fit")
- `price` - Base price (e.g., 29.99)
- `description` - Optional description
- `image_url` - Optional product image
- `is_active` - true/false (only active ones show on website)
- `display_order` - Controls ordering (1, 2, 3...)

**Example:**
```
type_id: athletic
name: Athletic Fit
price: 36.99
description: Performance fabric for active wear
is_active: true
display_order: 6
```

### Editing Existing Types

1. Click any row in `tshirt_types`
2. Edit the values
3. Click **Save**
4. Changes appear on website immediately! ✨

### Deactivating (Hiding) a Type

1. Find the t-shirt type row
2. Set `is_active` to `false`
3. It disappears from the Customize page

---

## 🎨 Managing Colors

### Add New Color

1. Go to **Supabase → Table Editor**
2. Click `tshirt_colors` table
3. Click **Insert Row**

**Fields:**
- `color_id` - Unique ID (e.g., "burgundy")
- `name` - Display name (e.g., "Burgundy")
- `hex_code` - Color hex code (e.g., "#800020")
- `is_active` - true/false
- `display_order` - Order on website (1, 2, 3...)

**Example:**
```
color_id: burgundy
name: Burgundy
hex_code: #800020
is_active: true
display_order: 9
```

### Change Color Order

1. Edit the `display_order` field
2. Lower numbers appear first
3. Save and refresh website

---

## 🔄 How It Works

**Backend API:**
- `GET /api/tshirt-options/types` - Returns active t-shirt types
- `GET /api/tshirt-options/colors` - Returns active colors

**Frontend:**
- Customize page fetches data when page loads
- Automatically sorts by `display_order`
- Only shows items where `is_active = true`

---

## ✨ Benefits

✅ **No Code Changes Needed** - Add/edit types and colors from Supabase
✅ **Instant Updates** - Changes reflect immediately on website
✅ **Easy Management** - Non-technical users can manage options
✅ **Flexible Pricing** - Each t-shirt type can have different price
✅ **Scalable** - Add unlimited types and colors

---

## 🎯 Next Steps

1. Run `add-tshirt-types-table.sql` in Supabase
2. Restart your backend server: `npm run server`
3. Refresh the Customize page
4. Test adding/editing types and colors in Supabase!

---

## 🚀 Quick Test

**Add a new color:**
```sql
INSERT INTO tshirt_colors (color_id, name, hex_code, display_order) 
VALUES ('mint', 'Mint Green', '#98FF98', 9);
```

Refresh the Customize page → See the new color! 🎨
