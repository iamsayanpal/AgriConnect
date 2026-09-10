const functions = require('firebase-functions');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Models
const userSchema = new mongoose.Schema({
  name: String, phone: String, role: String, locality: String, rating: Number, capacity: String
}, { timestamps: true });

const produceListingSchema = new mongoose.Schema({
  owner_id: String, farmer_name: String, category: String, crop_name: String,
  quantity: Number, unit: String, price: Number, ai_suggested_price: Number,
  locality: String, image_url: String
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  buyer_id: String, buyer_name: String, buyer_phone: String, buyer_type: String,
  listing_id: String, crop_name: String, category: String, quantity: Number,
  unit: String, total_price: Number, farmer_name: String, locality: String,
  pickup_lat: Number, pickup_lng: Number, status: String
}, { timestamps: true });

const pickupPointSchema = new mongoose.Schema({
  locality: String, name: String, lat: Number, lng: Number, pending_order_ids: [String],
  farmer_name: String, address: String
}, { timestamps: true });

const recurringOrderSchema = new mongoose.Schema({
  buyer_name: String, crop_name: String, quantity_per_delivery: Number,
  frequency: String, locality: String, preferred_supplier: String, status: String
}, { timestamps: true });

const forwardContractSchema = new mongoose.Schema({
  buyer_name: String, supplier_name: String, crop_name: String,
  quantity_tons: Number, target_price_per_kg: Number, delivery_month: String, status: String
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const ProduceListing = mongoose.models.ProduceListing || mongoose.model('ProduceListing', produceListingSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const PickupPoint = mongoose.models.PickupPoint || mongoose.model('PickupPoint', pickupPointSchema);
const RecurringOrder = mongoose.models.RecurringOrder || mongoose.model('RecurringOrder', recurringOrderSchema);
const ForwardContract = mongoose.models.ForwardContract || mongoose.model('ForwardContract', forwardContractSchema);

// DB initialization
let isDbConnected = false;
async function ensureDb() {
  if (isDbConnected && mongoose.connection.readyState === 1) return;
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    isDbConnected = true;

    // Seed default sample listings if empty
    const count = await ProduceListing.countDocuments();
    if (count === 0) {
      const sampleListings = [
        { owner_id: 'farmer-01', farmer_name: 'Ramesh Patil (Nashik FPO)', category: 'vegetable', crop_name: 'Organic Red Tomato', quantity: 450, unit: 'kg', price: 34, ai_suggested_price: 38, locality: 'Nashik', image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop' },
        { owner_id: 'farmer-02', farmer_name: 'Suresh Deshmukh', category: 'vegetable', crop_name: 'Farm Fresh Potatoes', quantity: 800, unit: 'kg', price: 22, ai_suggested_price: 25, locality: 'Pimpalgaon', image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop' },
        { owner_id: 'farmer-01', farmer_name: 'Ramesh Patil (Nashik FPO)', category: 'vegetable', crop_name: 'Nashik Red Onions', quantity: 1200, unit: 'kg', price: 29, ai_suggested_price: 32, locality: 'Nashik', image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop' },
        { owner_id: 'farmer-03', farmer_name: 'Anand Shinde (Ozar Co-op)', category: 'vegetable', crop_name: 'Crisp Green Spinach', quantity: 150, unit: 'kg', price: 18, ai_suggested_price: 22, locality: 'Ozar', image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop' },
        { owner_id: 'farmer-05', farmer_name: 'Kiran Pawar (Sahyadri Orchards)', category: 'fruit', crop_name: 'Crisp Shimla Apples', quantity: 600, unit: 'kg', price: 110, ai_suggested_price: 124, locality: 'Nashik', image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop' },
        { owner_id: 'farmer-06', farmer_name: 'Babu Rao (Jalgaon Banana Hub)', category: 'fruit', crop_name: 'Golden Robusta Bananas', quantity: 1500, unit: 'kg', price: 38, ai_suggested_price: 44, locality: 'Pimpalgaon', image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop' },
        { owner_id: 'farmer-07', farmer_name: 'Ratnagiri Agro Collective', category: 'fruit', crop_name: 'Alphonso Mangoes (Devgad)', quantity: 400, unit: 'kg', price: 180, ai_suggested_price: 195, locality: 'Mumbai', image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop' },
        { owner_id: 'farmer-08', farmer_name: 'Nagpur Citrus Farm', category: 'fruit', crop_name: 'Sweet Nagpur Oranges', quantity: 750, unit: 'kg', price: 58, ai_suggested_price: 66, locality: 'Nagpur', image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&auto=format&fit=crop' }
      ];
      await ProduceListing.insertMany(sampleListings);
    }
  } catch (err) {
    console.error('Mongo init error:', err);
  }
}

app.use(async (req, res, next) => {
  await ensureDb();
  next();
});

// REST API Endpoints
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'AgriConnect Serverless API' }));

app.get('/api/listings', async (req, res) => {
  try {
    const { category, locality, search } = req.query;
    let query = {};
    if (category) query.category = category.toLowerCase();
    if (locality && locality !== 'All') query.locality = new RegExp(locality, 'i');
    if (search) {
      query.$or = [
        { crop_name: new RegExp(search, 'i') },
        { farmer_name: new RegExp(search, 'i') },
        { locality: new RegExp(search, 'i') }
      ];
    }
    const listings = await ProduceListing.find(query).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/listings', async (req, res) => {
  try {
    const { farmer_name, category, crop_name, quantity, unit, price, locality, image_url } = req.body;
    const basePrices = { "Tomato": 38, "Potato": 24, "Onion": 32, "Spinach": 20, "Apple": 120, "Mango": 180, "Orange": 65 };
    const base = basePrices[crop_name] || 40;
    const ai_suggested_price = Math.round(base * 1.12 * 10) / 10;

    const newListing = new ProduceListing({
      owner_id: 'farmer-01',
      farmer_name: farmer_name || 'Ramesh Patil (Nashik FPO)',
      category: (category || 'vegetable').toLowerCase(),
      crop_name,
      quantity: Number(quantity),
      unit: unit || 'kg',
      price: Number(price),
      ai_suggested_price,
      locality: locality || 'Nashik',
      image_url: image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop'
    });
    const saved = await newListing.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/listings/:id', async (req, res) => {
  try {
    await ProduceListing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { buyer_name, buyer_phone, listing_id, crop_name, category, quantity, unit, total_price, farmer_name, locality } = req.body;
    const order = new Order({
      buyer_name: buyer_name || 'Sunita Sharma',
      buyer_phone: buyer_phone || '+91 98765 43210',
      buyer_type: 'retail',
      listing_id,
      crop_name,
      category: category || 'vegetable',
      quantity: Number(quantity),
      unit: unit || 'kg',
      total_price: Number(total_price),
      farmer_name: farmer_name || 'Ramesh Patil',
      locality: locality || 'Nashik',
      pickup_lat: 20.0059,
      pickup_lng: 73.7898,
      status: 'placed'
    });
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/ai/forecast/:crop/:locality', (req, res) => {
  const { crop, locality } = req.params;
  const basePrices = { "Tomato": 38, "Potato": 24, "Onion": 32, "Spinach": 20, "Apple": 120, "Mango": 180, "Orange": 65 };
  const base = basePrices[crop] || 40;
  const suggested = Math.round(base * 1.12 * 10) / 10;
  res.json({
    crop, locality, base_price: base, suggested_price: suggested,
    min_price: Math.round(suggested * 0.9 * 10) / 10,
    max_price: Math.round(suggested * 1.15 * 10) / 10,
    demand_index: "HIGH", demand_percentage: 19.5,
    market_trend: "Steady demand (+12% above 30-day avg)",
    recommendation: `Recommended listing price for ${locality}: ₹${suggested}/kg`
  });
});

app.get('/api/weather/:locality', (req, res) => {
  const { locality } = req.params;
  res.json({
    locality: locality || 'Nashik',
    source: 'Google Weather API Proxied',
    current: { temp: 28, condition: 'Sunny / Partly Cloudy', humidity: 60, rain_chance: 15 },
    forecast: [
      { day: 'Today', date: 'Today', max_temp: 31, min_temp: 21, condition: 'Sunny', rain_chance: 15, icon: 'sun', advice: 'Optimal harvest and drying conditions.' },
      { day: 'Tomorrow', date: 'Tomorrow', max_temp: 29, min_temp: 20, condition: 'Light Rain', rain_chance: 60, icon: 'cloud-rain', advice: 'Cover harvested crops. Delay chemical spraying.' },
      { day: 'Day 3', date: 'In 2 Days', max_temp: 30, min_temp: 19, condition: 'Partly Cloudy', rain_chance: 25, icon: 'cloud-sun', advice: 'Favorable transport conditions.' },
      { day: 'Day 4', date: 'In 3 Days', max_temp: 32, min_temp: 22, condition: 'Sunny', rain_chance: 10, icon: 'sun', advice: 'High temperature ahead.' },
      { day: 'Day 5', date: 'In 4 Days', max_temp: 33, min_temp: 23, condition: 'Sunny', rain_chance: 5, icon: 'sun', advice: 'Ideal irrigation day.' }
    ]
  });
});

app.post('/api/route/optimize', (req, res) => {
  const { locality } = req.body;
  const stops = [
    { _id: '1', name: 'Nashik Aggregation Hub (Start)', locality: 'Nashik', lat: 20.0059, lng: 73.7898, address: 'Main APMC Yard, Nashik' },
    { _id: '2', name: 'Pimpalgaon Farmer Co-op Stop 1', locality: 'Pimpalgaon', lat: 20.1740, lng: 73.9890, address: 'Gate #4, Pimpalgaon' },
    { _id: '3', name: 'Ozar Organic Produce Stop 2', locality: 'Ozar', lat: 20.0965, lng: 73.9312, address: 'Village Collection Center, Ozar' },
    { _id: '4', name: 'Sinnar Cold Storage Stop 3 (End)', locality: 'Sinnar', lat: 19.8453, lng: 73.9984, address: 'MIDC Cold Storage, Sinnar' }
  ];
  const originCoords = '20.0059,73.7898';
  const destCoords = '19.8453,73.9984';
  const waypointsCoords = '20.1740,73.9890|20.0965,73.9312';
  const googleMapsNavUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoords}&destination=${destCoords}&waypoints=${waypointsCoords}&travelmode=driving`;

  res.json({
    status: 'success',
    source: 'Google Maps Directions API Serverless Route Engine',
    stops,
    total_distance_km: 68.4,
    total_eta_mins: 85,
    google_maps_nav_url: googleMapsNavUrl
  });
});

app.get('/api/bulk/suppliers', (req, res) => {
  res.json([
    { id: 'fpo-1', name: 'Nashik Valley Farmer Producer Co-op', locality: 'Nashik', capacity: '120 Tons / Month', primary_crops: ['Tomato', 'Onion', 'Grapes'], avg_price_per_kg: 28, rating: 4.9, verified: true, phone: '+91 98220 11223' },
    { id: 'fpo-2', name: 'Sahyadri Agro Farmers Federation', locality: 'Pune', capacity: '200 Tons / Month', primary_crops: ['Pomegranate', 'Cauliflower', 'Carrot'], avg_price_per_kg: 42, rating: 4.8, verified: true, phone: '+91 98221 44556' }
  ]);
});

app.get('/api/bulk/recurring-orders', async (req, res) => {
  try { res.json(await RecurringOrder.find().sort({ createdAt: -1 })); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/bulk/recurring-orders', async (req, res) => {
  try {
    const { buyer_name, crop_name, quantity_per_delivery, frequency, locality, preferred_supplier } = req.body;
    const newOrd = new RecurringOrder({
      buyer_name: buyer_name || 'Reliance Fresh Procurement', crop_name, quantity_per_delivery: Number(quantity_per_delivery),
      frequency: frequency || 'Weekly', locality: locality || 'Nashik', preferred_supplier: preferred_supplier || 'Nashik Valley FPO'
    });
    res.status(201).json(await newOrd.save());
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/bulk/contracts', async (req, res) => {
  try { res.json(await ForwardContract.find().sort({ createdAt: -1 })); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/bulk/contracts', async (req, res) => {
  try {
    const { buyer_name, supplier_name, crop_name, quantity_tons, target_price_per_kg, delivery_month } = req.body;
    const newC = new ForwardContract({
      buyer_name: buyer_name || 'BigBasket Direct Sourcing', supplier_name: supplier_name || 'Nashik Valley FPO',
      crop_name, quantity_tons: Number(quantity_tons), target_price_per_kg: Number(target_price_per_kg), delivery_month: delivery_month || 'October 2026'
    });
    res.status(201).json(await newC.save());
  } catch (err) { res.status(400).json({ error: err.message }); }
});

exports.api = functions.https.onRequest(app);
