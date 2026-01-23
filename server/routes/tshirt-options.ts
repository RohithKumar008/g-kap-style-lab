import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

// Get all active t-shirt types
router.get('/types', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('tshirt_types')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch t-shirt types' });
  }
});

// Get all active colors
router.get('/colors', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('tshirt_colors')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch t-shirt colors' });
  }
});

export default router;
