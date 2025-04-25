import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Web3 from 'web3';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaWallet, FaSignOutAlt } from 'react-icons/fa';

const UserDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      fetchTransactions();
    }
  }, [user, navigate]);

  const fetchTransactions = async () => {
    if (token) {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data.filter((tx) => tx.userId === user.userId));
      } catch (error) {
        alert('Failed to load transactions.');
      }
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
        {!walletAddress ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg flex items-center glow-button ${
              theme === 'dark'
                ? 'bg-cyan text-dark-bg'
                : 'bg-cyan text-light-bg'
            } font-semibold`}
            onClick={connectWallet}
          >
            <FaWallet className="mr-2" /> Connect Wallet
          </motion.button>
        ) : (
          <div>
            <p
              className={`mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
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
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboard;