import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

// Get filter options (categories, collections, colors, sizes)
router.get('/filters', async (req: Request, res: Response) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('category, collection, colors, sizes');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Extract unique values
    const categories = new Set<string>();
    const collections = new Set<string>();
    const colors = new Set<string>();
    const sizes = new Set<string>();

    products?.forEach(product => {
      if (product.category) categories.add(product.category);
      if (product.collection) collections.add(product.collection);
      product.colors?.forEach((c: string) => colors.add(c));
      product.sizes?.forEach((s: string) => sizes.add(s));
    });

    res.json({
      categories: Array.from(categories).sort(),
      collections: Array.from(collections).sort(),
      colors: Array.from(colors).sort(),
      sizes: Array.from(sizes).sort()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
});

// Get all products with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, collection, sortBy, limit } = req.query;

    let query = supabase
      .from('products')
      .select('*');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (collection && collection !== 'all') {
      query = query.eq('collection', collection);
    }

    if (sortBy === 'price-low') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price-high') {
      query = query.order('price', { ascending: false });
    } else if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('is_bestseller', { ascending: false });
    }

    if (limit) {
      query = query.limit(Number(limit));
    }

    const { data: products, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Fetch all images for all products
    const productIds = products?.map(p => p.id) || [];
    const { data: images } = await supabase
      .from('product_images')
      .select('*')
      .in('product_id', productIds)
      .order('display_order', { ascending: true });

    // Attach all images to each product
    const productsWithImages = products?.map(product => {
      const productImages = images?.filter(img => img.product_id === product.id) || [];
      return {
        ...product,
        images: productImages
      };
    });

    res.json(productsWithImages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (productError) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Fetch product images
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', id)
      .order('display_order', { ascending: true });

    // Combine product with images
    const productWithImages = {
      ...product,
      images: images || []
    };

    res.json(productWithImages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only - for now without auth check)
router.post('/', async (req: Request, res: Response) => {
  try {
    const productData = req.body;

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only - for now without auth check)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only - for now without auth check)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
