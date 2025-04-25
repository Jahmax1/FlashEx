const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

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

// Get pending transactions (admin only)
router.get('/pending', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'PENDING' });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept a transaction (admin only)
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, { status: 'ACCEPTED' }, { new: true });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Decline a transaction (admin only)
router.post('/:id/decline', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, { status: 'DECLINED' }, { new: true });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction declined' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;