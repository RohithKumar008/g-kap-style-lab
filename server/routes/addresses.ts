import { Router } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all addresses for the authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch addresses' });
  }
});

// Create a new address
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    const addressData = {
      ...req.body,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from('addresses')
      .insert([addressData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: error.message || 'Failed to create address' });
  }
});

// Update an address
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const addressData = req.body;

    // Ensure user can only update their own addresses
    const { data, error } = await supabase
      .from('addresses')
      .update({
        ...addressData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: error.message || 'Failed to update address' });
  }
});

// Delete an address
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Ensure user can only delete their own addresses
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Address deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: error.message || 'Failed to delete address' });
  }
});

// Set an address as default
router.post('/:id/set-default', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // The trigger function in the database will handle unsetting other defaults
    const { data, error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error setting default address:', error);
    res.status(500).json({ error: error.message || 'Failed to set default address' });
  }
});

export default router;
