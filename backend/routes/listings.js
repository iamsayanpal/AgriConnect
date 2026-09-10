const express = require('express');
const router = express.Router();
const ProduceListing = require('../models/ProduceListing');
const axios = require('axios');

// GET /api/listings?category=vegetable|fruit&locality=...&search=...
router.get('/', async (req, res) => {
  try {
    const { category, locality, search } = req.query;
    let query = {};

    if (category) {
      query.category = category.toLowerCase();
    }

    if (locality && locality !== 'All') {
      query.locality = new RegExp(locality, 'i');
    }

    if (search) {
      query.$or = [
        { crop_name: new RegExp(search, 'i') },
        { farmer_name: new RegExp(search, 'i') },
        { locality: new RegExp(search, 'i') }
      ];
    }

    const listings = await ProduceListing.find(query).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/listings - Create new listing
router.post('/', async (req, res) => {
  try {
    const { owner_id, farmer_name, category, crop_name, quantity, unit, price, locality, image_url } = req.body;

    // Fetch AI suggested price from AI service proxy if possible
    let ai_suggested_price = req.body.ai_suggested_price;
    if (!ai_suggested_price) {
      try {
        const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        const response = await axios.get(`${aiUrl}/predict?crop=${encodeURIComponent(crop_name)}&locality=${encodeURIComponent(locality || 'Nashik')}`);
        ai_suggested_price = response.data.suggested_price;
      } catch (err) {
        // Fallback default formula
        ai_suggested_price = Math.round(price * 1.05 * 10) / 10;
      }
    }

    const newListing = new ProduceListing({
      owner_id: owner_id || 'farmer-01',
      farmer_name: farmer_name || 'Ramesh Patil (FPO Nashik)',
      category: category.toLowerCase(),
      crop_name,
      quantity: Number(quantity),
      unit: unit || 'kg',
      price: Number(price),
      ai_suggested_price: Number(ai_suggested_price),
      locality: locality || 'Nashik',
      image_url: image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop'
    });

    const saved = await newListing.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/listings/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await ProduceListing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/listings/:id
router.delete('/:id', async (req, res) => {
  try {
    await ProduceListing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
