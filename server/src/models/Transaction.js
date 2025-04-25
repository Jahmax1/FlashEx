const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: { type: String, enum: ['buy', 'sell'], required: true },
  crypto: { type: String, required: true },
  amount: { type: Number, required: true },
  fiat: { type: String, required: true },
  bank: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'DECLINED'], default: 'PENDING' },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);