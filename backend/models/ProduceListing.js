const mongoose = require('mongoose');

const produceListingSchema = new mongoose.Schema({
  owner_id: { type: String, required: true },
  farmer_name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['vegetable', 'fruit'], 
    required: true 
  },
  crop_name: { type: String, required: true },
  quantity: { type: Number, required: true }, // in kg
  unit: { type: String, default: 'kg' },
  price: { type: Number, required: true }, // ₹ per kg
  ai_suggested_price: { type: Number },
  locality: { type: String, required: true },
  image_url: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ProduceListing', produceListingSchema);
