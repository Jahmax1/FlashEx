import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Web3 from 'web3';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BuySell = () => {
  const { theme } = useContext(ThemeContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ action: 'buy', crypto: 'BTC', amount: '', fiat: 'USD', bank: '' });
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setWalletAddress(accounts[0]);
      } catch (error) {
        alert('Failed to connect wallet.');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!walletAddress) {
      alert('Please connect your wallet!');
      return;
    }
    if (!form.amount || !form.bank) {
      alert('Please fill in all fields.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/transactions',
        {
          action: form.action,
          crypto: form.crypto,
          amount: parseFloat(form.amount),
          fiat: form.fiat,
          bank: form.bank,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Request submitted!');
      setForm({ action: 'buy', crypto: 'BTC', amount: '', fiat: 'USD', bank: '' });
    } catch (error) {
      alert('Failed to submit request.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white bg-opacity-10 rounded-xl p-8 max-w-md w-full ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
      >
        <h2 className="text-2xl font-bold mb-6">Buy or Sell Crypto</h2>
        <form onSubmit={handleSubmit}>
          <select
            className={`w-full p-3 mb-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            value={form.action}
            onChange={(e) => setForm({ ...form, action: e.target.value })}
          >
            <option value="buy">Buy Crypto</option>
            <option value="sell">Sell Crypto</option>
          </select>
          <select
            className={`w-full p-3 mb-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            value={form.crypto}
            onChange={(e) => setForm({ ...form, crypto: e.target.value })}
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
          </select>
          <input
            type="number"
            className={`w-full p-3 mb-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="Amount"
            step="0.0001"
            required
          />
          <select
            className={`w-full p-3 mb-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            value={form.fiat}
            onChange={(e) => setForm({ ...form, fiat: e.target.value })}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <input
            type="text"
            className={`w-full p-3 mb-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            value={form.bank}
            onChange={(e) => setForm({ ...form, bank: e.target.value })}
            placeholder="Bank Account/IBAN"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-neon-green text-black' : 'bg-blue-600 text-white'}`}
            type="submit"
          >
            Submit Request
          </motion.button>
        </form>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className={`mt-4 w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}
          onClick={connectWallet}
        >
          {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : 'Connect Wallet'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default BuySell;