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
    console.error('Error submitting transaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's transactions (authenticated users only)
router.get('/my-transactions', auth, role('user'), async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).json({ error: 'Failed to load transactions' });
  }
});

// Get pending transactions (admin only)
router.get('/pending', auth, role('admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'PENDING' });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    res.status(500).json({ error: 'Failed to load transactions' });
  }
});

// Accept a transaction (admin only)
router.post('/:id/accept', auth, role('admin'), async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: 'ACCEPTED' },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction accepted' });
  } catch (error) {
    console.error('Error accepting transaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Decline a transaction (admin only)
router.post('/:id/decline', auth, role('admin'), async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: 'DECLINED' },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction declined' });
  } catch (error) {
    console.error('Error declining transaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;