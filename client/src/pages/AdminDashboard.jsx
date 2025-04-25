import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
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
        setTransactions(res.data);
      } catch (error) {
        alert('Failed to load transactions.');
      }
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axios.post(
        `http://localhost:5000/api/transactions/${id}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(transactions.filter((tx) => tx._id !== id));
      alert(`Transaction ${action}ed!`);
    } catch (error) {
      alert(`Failed to ${action} transaction.`);
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
            Admin Dashboard
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg glow-button mt-4 sm:mt-0 ${
              theme === 'dark' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
            } font-semibold flex items-center`}
            onClick={logout}
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </motion.button>
        </div>
        <h3
          className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-text-light'
          }`}
        >
          Pending Transactions
        </h3>
        {transactions.length === 0 ? (
          <p
            className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            No pending transactions.
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
                  <th className="p-2">User</th>
                  <th className="p-2">Action</th>
                  <th className="p-2">Crypto</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Fiat</th>
                  <th className="p-2">Actions</th>
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
                    <td className="p-2">{tx.userId.slice(0, 6)}...</td>
                    <td className="p-2">{tx.action}</td>
                    <td className="p-2">{tx.crypto}</td>
                    <td className="p-2">{tx.amount}</td>
                    <td className="p-2">{tx.fiat}</td>
                    <td className="p-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 py-1 bg-neon-green text-dark-bg rounded mr-2 glow-button"
                        onClick={() => handleAction(tx._id, 'accept')}
                      >
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 py-1 bg-red-500 text-white rounded glow-button"
                        onClick={() => handleAction(tx._id, 'decline')}
                      >
                        Decline
                      </motion.button>
                    </td>
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

export default AdminDashboard;