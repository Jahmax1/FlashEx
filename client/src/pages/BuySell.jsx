import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Web3 from 'web3';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';

const BuySell = () => {
  const { theme } = useContext(ThemeContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ action: 'buy', crypto: 'BTC', amount: '', fiat: 'USD', bank: '' });
  const [walletAddress, setWalletAddress] = useState('');
  const [prices, setPrices] = useState({ btc: 0, eth: 0 });
  const [priceChanges, setPriceChanges] = useState({ btc: 0, eth: 0 });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      fetchPrices();
      const interval = setInterval(fetchPrices, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [user, navigate]);

  const fetchPrices = async () => {
    try {
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
      );
      const newPrices = {
        btc: res.data.bitcoin.usd,
        eth: res.data.ethereum.usd,
      };
      setPriceChanges({
        btc: newPrices.btc > prices.btc ? 1 : newPrices.btc < prices.btc ? -1 : 0,
        eth: newPrices.eth > prices.eth ? 1 : newPrices.eth < prices.eth ? -1 : 0,
      });
      setPrices(newPrices);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    }
  };

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
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-dark-bg to-gray-900'
          : 'bg-gradient-to-br from-light-bg to-gray-200'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 max-w-lg w-full"
      >
        <h2
          className={`text-3xl font-bold mb-6 ${
            theme === 'dark' ? 'text-neon-blue' : 'text-gray-800'
          }`}
        >
          Buy or Sell Crypto
        </h2>
        <div className="flex justify-between mb-6">
          <div className="flex items-center">
            <FaBitcoin className="text-yellow-500 mr-2" size={24} />
            <span
              className={`font-semibold ${
                priceChanges.btc === 1
                  ? 'text-green-500'
                  : priceChanges.btc === -1
                  ? 'text-red-500'
                  : 'text-gray-500'
              }`}
            >
              BTC: ${prices.btc.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center">
            <FaEthereum className="text-blue-500 mr-2" size={24} />
            <span
              className={`font-semibold ${
                priceChanges.eth === 1
                  ? 'text-green-500'
                  : priceChanges.eth === -1
                  ? 'text-red-500'
                  : 'text-gray-500'
              }`}
            >
              ETH: ${prices.eth.toLocaleString()}
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <select
            className={`w-full p-3 mb-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-gray-100 text-gray-800 border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-neon-blue`}
            value={form.action}
            onChange={(e) => setForm({ ...form, action: e.target.value })}
          >
            <option value="buy">Buy Crypto</option>
            <option value="sell">Sell Crypto</option>
          </select>
          <select
            className={`w-full p-3 mb-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-gray-100 text-gray-800 border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-neon-blue`}
            value={form.crypto}
            onChange={(e) => setForm({ ...form, crypto: e.target.value })}
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
          </select>
          <input
            type="number"
            className={`w-full p-3 mb-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-gray-100 text-gray-800 border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-neon-blue`}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="Amount"
            step="0.0001"
            required
          />
          <select
            className={`w-full p-3 mb-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-gray-100 text-gray-800 border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-neon-blue`}
            value={form.fiat}
            onChange={(e) => setForm({ ...form, fiat: e.target.value })}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <input
            type="text"
            className={`w-full p-3 mb-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-gray-100 text-gray-800 border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-neon-blue`}
            value={form.bank}
            onChange={(e) => setForm({ ...form, bank: e.target.value })}
            placeholder="Bank Account/IBAN"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full p-3 rounded-lg ${
              theme === 'dark'
                ? 'bg-neon-green text-black'
                : 'bg-blue-600 text-white'
            } font-semibold`}
            type="submit"
          >
            Submit Request
          </motion.button>
        </form>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`mt-4 w-full p-3 rounded-lg ${
            theme === 'dark'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-black'
          } font-semibold`}
          onClick={connectWallet}
        >
          {walletAddress
            ? `Connected: ${walletAddress.slice(0, 6)}...`
            : 'Connect Wallet'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default BuySell;