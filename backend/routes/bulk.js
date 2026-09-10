const express = require('express');
const router = express.Router();
const RecurringOrder = require('../models/RecurringOrder');
const ForwardContract = require('../models/ForwardContract');
const User = require('../models/User');

// GET /api/bulk/suppliers - List FPOs and bulk farmer suppliers
router.get('/suppliers', async (req, res) => {
  try {
    const suppliers = [
      {
        id: 'fpo-1',
        name: 'Nashik Valley Farmer Producer Co-op',
        locality: 'Nashik',
        capacity: '120 Tons / Month',
        primary_crops: ['Tomato', 'Onion', 'Grapes'],
        avg_price_per_kg: 28,
        rating: 4.9,
        verified: true,
        phone: '+91 98220 11223'
      },
      {
        id: 'fpo-2',
        name: 'Sahyadri Agro Farmers Federation',
        locality: 'Pune',
        capacity: '200 Tons / Month',
        primary_crops: ['Pomegranate', 'Cauliflower', 'Carrot'],
        avg_price_per_kg: 42,
        rating: 4.8,
        verified: true,
        phone: '+91 98221 44556'
      },
      {
        id: 'fpo-3',
        name: 'Konkan Fruit Growers Collective',
        locality: 'Ratnagiri / Mumbai Hub',
        capacity: '80 Tons / Month',
        primary_crops: ['Mango', 'Banana', 'Papaya'],
        avg_price_per_kg: 65,
        rating: 4.95,
        verified: true,
        phone: '+91 98222 77889'
      },
      {
        id: 'fpo-4',
        name: 'GreenField Organic FPO',
        locality: 'Aurangabad',
        capacity: '95 Tons / Month',
        primary_crops: ['Spinach', 'Brinjal', 'Garlic', 'Ginger'],
        avg_price_per_kg: 35,
        rating: 4.7,
        verified: true,
        phone: '+91 98223 99001'
      }
    ];

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET & POST /api/bulk/recurring-orders
router.get('/recurring-orders', async (req, res) => {
  try {
    const orders = await RecurringOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/recurring-orders', async (req, res) => {
  try {
    const { buyer_name, crop_name, quantity_per_delivery, frequency, locality, preferred_supplier } = req.body;
    const newOrder = new RecurringOrder({
      buyer_name: buyer_name || 'Reliance Fresh Procurement',
      crop_name,
      quantity_per_delivery: Number(quantity_per_delivery),
      frequency: frequency || 'Weekly',
      locality: locality || 'Nashik',
      preferred_supplier: preferred_supplier || 'Nashik Valley Farmer Producer Co-op'
    });
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET & POST /api/bulk/contracts (Forward-pricing)
router.get('/contracts', async (req, res) => {
  try {
    const contracts = await ForwardContract.find().sort({ createdAt: -1 });
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/contracts', async (req, res) => {
  try {
    const { buyer_name, supplier_name, crop_name, quantity_tons, target_price_per_kg, delivery_month } = req.body;
    const newContract = new ForwardContract({
      buyer_name: buyer_name || 'BigBasket Bulk Cell',
      supplier_name: supplier_name || 'Nashik Valley Farmer Producer Co-op',
      crop_name,
      quantity_tons: Number(quantity_tons),
      target_price_per_kg: Number(target_price_per_kg),
      delivery_month: delivery_month || 'October 2026'
    });
    const saved = await newContract.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
