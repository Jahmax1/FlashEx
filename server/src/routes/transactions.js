const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const axios = require('axios');
const { sendAdminNotification } = require('../utils/notifications');

// Submit a transaction (authenticated users only)
router.post('/', auth, role('user'), async (req, res) => {
  try {
    const { action, crypto, amount, fiat, bank } = req.body;
    if (!action || !crypto || !amount || !fiat || !bank) {
      return res.status(400).json({ error: 'All fields required' });
    }
    if (!['buy', 'sell'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }
    if (!['BTC', 'ETH'].includes(crypto)) {
      return res.status(400).json({ error: 'Invalid crypto' });
    }
    if (!['USD', 'EUR'].includes(fiat)) {
      return res.status(400).json({ error: 'Invalid fiat' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch real-time crypto price
    const priceRes = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${crypto === 'BTC' ? 'bitcoin' : 'ethereum'}&vs_currencies=${fiat.toLowerCase()}`
    );
    const price = priceRes.data[crypto.toLowerCase()][fiat.toLowerCase()];
    const fiatCost = amount * price;

    // Validate balances
    if (action === 'buy' && user.balances[fiat] < fiatCost) {
      return res.status(400).json({ error: `Insufficient ${fiat} balance` });
    }
    if (action === 'sell' && user.balances[crypto] < amount) {
      return res.status(400).json({ error: `Insufficient ${crypto} balance` });
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
    console.error('Error submitting transaction:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's transactions (authenticated users only)
router.get('/my-transactions', auth, role('user'), async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching user transactions:', error.message);
    res.status(500).json({ error: 'Failed to load transactions' });
  }
});

// Get pending transactions (admin only)
router.get('/pending', auth, role('admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'PENDING' });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching pending transactions:', error.message);
    res.status(500).json({ error: 'Failed to load transactions' });
  }
});

// Accept a transaction (admin only)
router.post('/:id/accept', auth, role('admin'), async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const user = await User.findById(transaction.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch real-time crypto price
    const priceRes = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${transaction.crypto === 'BTC' ? 'bitcoin' : 'ethereum'}&vs_currencies=${transaction.fiat.toLowerCase()}`
    );
    const price = priceRes.data[transaction.crypto.toLowerCase()][transaction.fiat.toLowerCase()];
    const fiatAmount = transaction.amount * price;

    // Update balances
    if (transaction.action === 'buy') {
      user.balances[transaction.crypto] = (user.balances[transaction.crypto] || 0) + transaction.amount;
      user.balances[transaction.fiat] = (user.balances[transaction.fiat] || 0) - fiatAmount;
    } else if (transaction.action === 'sell') {
      user.balances[transaction.crypto] = (user.balances[transaction.crypto] || 0) - transaction.amount;
      user.balances[transaction.fiat] = (user.balances[transaction.fiat] || 0) + fiatAmount;
    }

    await user.save();
    transaction.status = 'ACCEPTED';
    await transaction.save();

    res.json({ message: 'Transaction accepted' });
  } catch (error) {
    console.error('Error accepting transaction:', error.message);
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
    console.error('Error declining transaction:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;