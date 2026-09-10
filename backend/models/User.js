const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['farmer', 'consumer', 'bulk_buyer'], 
    required: true 
  },
  locality: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  capacity: { type: String, default: '50 Tons / Month' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
