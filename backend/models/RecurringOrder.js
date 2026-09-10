const mongoose = require('mongoose');

const recurringOrderSchema = new mongoose.Schema({
  buyer_name: { type: String, required: true },
  crop_name: { type: String, required: true },
  quantity_per_delivery: { type: Number, required: true }, // in kg
  frequency: { type: String, enum: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'], default: 'Weekly' },
  locality: { type: String, required: true },
  preferred_supplier: { type: String, default: 'Open FPO Network' },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('RecurringOrder', recurringOrderSchema);
