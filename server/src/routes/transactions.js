const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { sendAdminNotification } = require('../utils/notifications');

// Submit a transaction (authenticated users only)
router.post('/', auth, role('user'), async (req, res) => {
  try {
    const { action, crypto, amount, fiat, bank } = req.body;
    if (!action || !crypto || !amount || !fiat || !bank) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const transaction = new Transaction({
      userId: req.user.userId,
      action,
      crypto,
      amount,
      fiat,
      bank,
    });
    await transaction.save();
    await sendAdminNotification(transaction);
    res.status(201).json({ message: 'Request submitted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pending transactions (admin only)
router.get('/pending', auth, role('admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'PENDING' });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept a transaction (admin only)
router.post('/:id/accept', auth, role('admin'), async (req, res) => {
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
router.post('/:id/decline', auth, role('admin'), async (req, res) => {
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