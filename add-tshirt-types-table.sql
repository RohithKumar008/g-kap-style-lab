-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create t-shirt types table for customization options
CREATE TABLE tshirt_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default t-shirt types
INSERT INTO tshirt_types (type_id, name, price, description, display_order) VALUES
  ('regular', 'Regular Fit', 29.99, 'Classic comfortable fit', 1),
  ('oversized', 'Oversized', 34.99, 'Relaxed oversized style', 2),
  ('premium', 'Premium Cotton', 39.99, 'High-quality premium fabric', 3),
  ('polo', 'Polo', 44.99, 'Collared polo style', 4),
  ('longsleeve', 'Long Sleeve', 39.99, 'Full sleeve coverage', 5);

-- Create t-shirt colors table
CREATE TABLE tshirt_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  color_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  hex_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default colors
INSERT INTO tshirt_colors (color_id, name, hex_code, display_order) VALUES
  ('white', 'White', '#FFFFFF', 1),
  ('black', 'Black', '#1a1a1a', 2),
  ('gray', 'Gray', '#6B7280', 3),
  ('navy', 'Navy', '#1e3a5f', 4),
  ('sage', 'Sage', '#9DC183', 5),
  ('coral', 'Coral', '#FF7F50', 6),
  ('lavender', 'Lavender', '#E6E6FA', 7),
  ('cream', 'Cream', '#FFFDD0', 8);

-- Enable RLS
ALTER TABLE tshirt_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tshirt_colors ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read (for the customize page)
CREATE POLICY "Anyone can view active tshirt types" ON tshirt_types FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view active colors" ON tshirt_colors FOR SELECT 
USING (is_active = true);

-- Create indexes
CREATE INDEX idx_tshirt_types_active ON tshirt_types(is_active, display_order);
CREATE INDEX idx_tshirt_colors_active ON tshirt_colors(is_active, display_order);

-- Add trigger for updated_at
CREATE TRIGGER update_tshirt_types_updated_at 
BEFORE UPDATE ON tshirt_types 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
