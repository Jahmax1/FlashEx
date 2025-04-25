const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction'); // Adjusted path

// Submit a transaction
router.post('/', async (req, res) => {
  try {
    const { userId, action, crypto, amount, fiat, bank } = req.body;
    if (!userId || !action || !crypto || !amount || !fiat || !bank) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const transaction = new Transaction({ userId, action, crypto, amount, fiat, bank });
    await transaction.save();
    res.status(201).json({ message: 'Request submitted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pending transactions
router.get('/pending', async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'PENDING' });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;