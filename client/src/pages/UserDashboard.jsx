import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Web3 from 'web3';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaWallet, FaSignOutAlt, FaBitcoin, FaEthereum, FaDollarSign, FaEuroSign } from 'react-icons/fa';

const UserDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState({ BTC: 0, ETH: 0, USD: 0, EUR: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      console.log('No user or token, redirecting to /auth');
      navigate('/auth');
      return;
    }

    const initialize = async () => {
      setIsLoading(true);
      await Promise.all([fetchTransactions(), fetchBalances()]);
      setIsLoading(false);
    };

    initialize();
  }, [user, token, navigate]);

  useEffect(() => {
    if (walletAddress) {
      fetchBalances();
    }
  }, [walletAddress]);

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/transactions/my-transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
      setError('');
    } catch (error) {
      console.error('Transaction fetch error:', error.message);
      setError(error.response?.data?.error || 'Failed to load transactions');
    }
  };

  const fetchBalances = async () => {
    if (!token) return;
    try {
      // Fetch fiat balances from MongoDB
      const fiatRes = await axios.get('http://localhost:5000/api/users/balance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalances((prev) => ({ ...prev, ...fiatRes.data }));

      // Fetch crypto balances only if wallet is connected and MetaMask is available
      if (walletAddress && window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const ethBalance = await web3.eth.getBalance(walletAddress);
          setBalances((prev) => ({
            ...prev,
            ETH: parseFloat(web3.utils.fromWei(ethBalance, 'ether')).toFixed(4),
            BTC: 0, // Placeholder (requires Bitcoin API)
          }));
        } catch (web3Error) {
          console.error('Web3 balance fetch failed:', web3Error.message);
          setError('Failed to fetch crypto balances');
        }
      }
    } catch (error) {
      console.error('Balance fetch error:', error.message);
      setError(error.response?.data?.error || 'Failed to load balances');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask!');
      return;
    }
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      setWalletAddress(accounts[0]);
      setError('');
      console.log('Wallet connected:', accounts[0]);
    } catch (error) {
      console.error('Wallet connection error:', error.message);
      setError('Failed to connect wallet');
    }
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-dark-bg to-[#1A1A3E]'
            : 'bg-gradient-to-br from-light-bg to-[#E5E7EB]'
        }`}
      >
        <p
          className={`text-xl ${
            theme === 'dark' ? 'text-cyan' : 'text-text-light'
          }`}
        >
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-dark-bg to-[#1A1A3E]'
          : 'bg-gradient-to-br from-light-bg to-[#E5E7EB]'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass rounded-2xl p-8 max-w-4xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2
            className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-cyan' : 'text-text-light'
            }`}
          >
            User Dashboard
          </h2>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg glow-button ${
                theme === 'dark'
                  ? 'bg-cyan text-dark-bg'
                  : 'bg-cyan text-light-bg'
              } font-semibold`}
              onClick={() => navigate('/buy-sell')}
            >
              Buy/Sell
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg glow-button ${
                theme === 'dark' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
              } font-semibold flex items-center`}
              onClick={logout}
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </motion.button>
          </div>
        </div>
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-lg flex items-center glow-button ${
            theme === 'dark'
              ? 'bg-cyan text-dark-bg'
              : 'bg-cyan text-light-bg'
            } font-semibold mb-6`}
          onClick={connectWallet}
        >
          <FaWallet className="mr-2" />
          {walletAddress
            ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : 'Connect Wallet'}
        </motion.button>
        <h3
          className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-text-light'
          }`}
        >
          Wallet Balances
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="glass p-4 rounded-lg flex items-center">
            <FaBitcoin className="text-yellow-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-400">Bitcoin</p>
              <p
                className={`${
                  theme === 'dark' ? 'text-white' : 'text-text-light'
                } font-semibold`}
              >
                {balances.BTC.toFixed(4)} BTC
              </p>
            </div>
          </div>
          <div className="glass p-4 rounded-lg flex items-center">
            <FaEthereum className="text-blue-400 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-400">Ethereum</p>
              <p
                className={`${
                  theme === 'dark' ? 'text-white' : 'text-text-light'
                } font-semibold`}
              >
                {balances.ETH.toFixed(4)} ETH
              </p>
            </div>
          </div>
          <div className="glass p-4 rounded-lg flex items-center">
            <FaDollarSign className="text-green-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-400">US Dollar</p>
              <p
                className={`${
                  theme === 'dark' ? 'text-white' : 'text-text-light'
                } font-semibold`}
              >
                ${balances.USD.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="glass p-4 rounded-lg flex items-center">
            <FaEuroSign className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-400">Euro</p>
              <p
                className={`${
                  theme === 'dark' ? 'text-white' : 'text-text-light'
                } font-semibold`}
              >
                €{balances.EUR.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <h3
          className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-text-light'
          }`}
        >
          Transaction History
        </h3>
        {transactions.length === 0 ? (
          <p
            className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            No transactions yet.
          </p>
        ) : (
          <div className="glass p-4 rounded-lg overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className={`${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <th className="p-2">Action</th>
                  <th className="p-2">Crypto</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className={`${
                      theme === 'dark' ? 'text-white' : 'text-text-light'
                    }`}
                  >
                    <td className="p-2">{tx.action}</td>
                    <td className="p-2">{tx.crypto}</td>
                    <td className="p-2">{tx.amount}</td>
                    <td className="p-2">{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboard;