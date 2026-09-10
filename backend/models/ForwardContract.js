const mongoose = require('mongoose');

const forwardContractSchema = new mongoose.Schema({
  buyer_name: { type: String, required: true },
  supplier_name: { type: String, required: true },
  crop_name: { type: String, required: true },
  quantity_tons: { type: Number, required: true },
  target_price_per_kg: { type: Number, required: true },
  delivery_month: { type: String, required: true },
  status: { type: String, enum: ['Pending Approval', 'Accepted', 'In Fulfillment', 'Completed'], default: 'Pending Approval' }
}, { timestamps: true });

module.exports = mongoose.model('ForwardContract', forwardContractSchema);
