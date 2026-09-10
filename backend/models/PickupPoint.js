const mongoose = require('mongoose');

const pickupPointSchema = new mongoose.Schema({
  locality: { type: String, required: true },
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  pending_order_ids: [{ type: String }],
  farmer_name: { type: String, default: 'Local Village Co-op' },
  address: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('PickupPoint', pickupPointSchema);
