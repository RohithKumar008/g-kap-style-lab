import { Router, Response } from 'express';
import { supabase } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { sendOrderNotification } from '../utils/email';

const router = Router();

// Get user's orders
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      items,
      shipping_address,
      shipping_method,
      payment_method,
      subtotal,
      shipping_cost,
      tax,
      total,
    } = req.body;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        shipping_address,
        shipping_method,
        payment_method,
        subtotal,
        shipping_cost,
        tax,
        total,
        status: 'pending',
      }])
      .select()
      .single();

    if (orderError) {
      return res.status(400).json({ error: orderError.message });
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id || null, // Can be null for custom designs
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.price,
      design_id: item.design_id || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      return res.status(400).json({ error: itemsError.message });
    }

    // Fetch custom design info if present
    let customDesignInfo = '';
    let customDesignImage = '';
    const customItem = items.find((item: any) => item.design_id);
    if (customItem && customItem.design_id) {
      const { data: design } = await supabase
        .from('custom_designs')
        .select('*')
        .eq('id', customItem.design_id)
        .single();
      if (design) {
        customDesignInfo = `\nCustom Design: ${design.tshirt_type} - ${design.tshirt_color}, Size: ${design.size}, Qty: ${design.quantity}`;
        if (design.image_url) {
          customDesignImage = `<br><b>Uploaded Logo:</b><br><img src="${design.image_url}" alt="Custom Logo" style="max-width:200px;">`;
        }
      }
    }

    // Send notification email
    try {
      await sendOrderNotification({
        to: process.env.NOTIFY_EMAIL_TO || process.env.NOTIFY_EMAIL_USER,
        subject: `New Order Received: ${order.id}`,
        html: `
          <h2>New Order Placed</h2>
          <b>Order ID:</b> ${order.id}<br>
          <b>Location:</b> ${shipping_address?.city || ''}, ${shipping_address?.state || ''}, ${shipping_address?.country || ''}<br>
          <b>Order Details:</b> ${items.map((item: any) => `${item.product_id ? 'Product' : 'Custom'} - Size: ${item.size}, Color: ${item.color}, Qty: ${item.quantity}`).join(', ')}
          ${customDesignInfo}
          ${customDesignImage}
        `,
      });
    } catch (e) {
      // Log but don't block order creation
      console.error('Order notification email failed:', e);
    }

    // Clear cart after order
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;
