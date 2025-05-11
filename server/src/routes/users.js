const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Get user balance (authenticated users only)
router.get('/balance', auth, role('user'), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('balances');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.balances) {
      return res.status(400).json({ error: 'Balances not initialized' });
    }
    res.json(user.balances);
  } catch (error) {
    console.error('Error fetching balance:', error.message);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Update fiat balance (for testing, admin only)
router.post('/balance', auth, role('admin'), async (req, res) => {
  try {
    const { userId, currency, amount } = req.body;
    if (!userId || !currency || !amount) {
      return res.status(400).json({ error: 'All fields required' });
    }
    if (!['USD', 'EUR'].includes(currency)) {
      return res.status(400).json({ error: 'Invalid currency' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.balances[currency] = (user.balances[currency] || 0) + amount;
    await user.save();
    res.json({ message: 'Balance updated', balances: user.balances });
  } catch (error) {
    console.error('Error updating balance:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;