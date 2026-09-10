const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer_id: { type: String, default: 'consumer-01' },
  buyer_name: { type: String, default: 'Retail Buyer' },
  buyer_phone: { type: String, default: '+91 98765 43210' },
  buyer_type: { type: String, enum: ['retail', 'bulk'], default: 'retail' },
  listing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProduceListing' },
  crop_name: { type: String, required: true },
  category: { type: String, default: 'vegetable' },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  total_price: { type: Number, required: true },
  farmer_name: { type: String, required: true },
  locality: { type: String, required: true },
  pickup_lat: { type: Number, default: 20.0059 },
  pickup_lng: { type: Number, default: 73.7898 },
  status: { 
    type: String, 
    enum: ['placed', 'picked up', 'in transit', 'delivered'], 
    default: 'placed' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
