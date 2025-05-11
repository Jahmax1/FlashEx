const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  balances: {
    BTC: { type: Number, default: 0 },
    ETH: { type: Number, default: 0 },
    USD: { type: Number, default: 1000 }, // Default for testing
    EUR: { type: Number, default: 1000 }, // Default for testing
  },
});

module.exports = mongoose.model('User', userSchema);