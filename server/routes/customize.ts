import { Router, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get user's custom designs
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from('custom_designs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
});

// Upload custom design (or update existing)
router.post('/', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const file = req.file;
    const { existing_image_url, designId } = req.body;
    
    // Either a new file OR an existing image URL (for edits) must be provided
    if (!file && !existing_image_url) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const {
      tshirt_type,
      tshirt_color,
      size,
      print_location,
      quantity,
      image_scale,
      image_rotation,
    } = req.body;

    let imageUrl = existing_image_url;

    // If a new file is uploaded, upload it to storage
    if (file) {
      const fileName = `${userId}/${uuidv4()}-${file.originalname}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-designs')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (uploadError) {
        return res.status(400).json({ error: uploadError.message });
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-designs')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrl;
    }

    // If editing, update existing design
    if (designId) {
      const { data, error } = await supabase
        .from('custom_designs')
        .update({
          image_url: imageUrl,
          tshirt_type,
          tshirt_color,
          size,
          print_location,
          quantity,
          image_scale: parseFloat(image_scale),
          image_rotation: parseFloat(image_rotation),
        })
        .eq('id', designId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.json(data);
    }

    // Otherwise, create new design
    const { data, error } = await supabase
      .from('custom_designs')
      .insert([{
        user_id: userId,
        image_url: imageUrl,
        tshirt_type,
        tshirt_color,
        size,
        print_location,
        quantity,
        image_scale: parseFloat(image_scale),
        image_rotation: parseFloat(image_rotation),
        status: 'pending',
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save design' });
  }
});

// Get single design (public - for editing)
router.get('/design/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('custom_designs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Design not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch design' });
  }
});

// Get single design (authenticated)
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from('custom_designs')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Design not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch design' });
  }
});

// Delete design
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Get design to delete image from storage
    const { data: design } = await supabase
      .from('custom_designs')
      .select('image_url')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (design?.image_url) {
      // Extract file path from URL
      const urlParts = design.image_url.split('/');
      const filePath = urlParts.slice(-2).join('/');
      
      await supabase.storage
        .from('user-designs')
        .remove([filePath]);
    }

    const { error } = await supabase
      .from('custom_designs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete design' });
  }
});

export default router;
