const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const ProduceListing = require('../models/ProduceListing');

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const { buyer_name, listing_id, crop_name, category, quantity, unit, total_price, farmer_name, locality, pickup_lat, pickup_lng } = req.body;

    // Deduct quantity from listing if listing_id provided
    if (listing_id) {
      const listing = await ProduceListing.findById(listing_id);
      if (listing) {
        listing.quantity = Math.max(0, listing.quantity - Number(quantity));
        await listing.save();
      }
    }

    const order = new Order({
      buyer_name: buyer_name || 'Sunita Sharma',
      listing_id,
      crop_name,
      category: category || 'vegetable',
      quantity: Number(quantity),
      unit: unit || 'kg',
      total_price: Number(total_price),
      farmer_name: farmer_name || 'Ramesh Patil',
      locality: locality || 'Nashik',
      pickup_lat: pickup_lat || 20.0059,
      pickup_lng: pickup_lng || 73.7898,
      status: 'placed'
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/orders/:id/status - Update order tracking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
