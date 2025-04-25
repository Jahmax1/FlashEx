import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';

const AdminDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [transactions, setTransactions] = useState([]);

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setToken(res.data.token);
      localStorage.setItem('adminToken', res.data.token);
      setEmail('');
      setPassword('');
    } catch (error) {
      alert('Login failed!');
    }
  };

  useEffect(() => {
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
    fetchTransactions();
  }, [token]);

  const handleAction = async (id, action) => {
    try {
      await axios.post(`http://localhost:5000/api/transactions/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter((tx) => tx._id !== id));
      alert(`Transaction ${action}ed!`);
    } catch (error) {
      alert(`Failed to ${action} transaction.`);
    }
  };

  if (!token) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white bg-opacity-10 rounded-xl p-8 max-w-md w-full ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
        >
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
          <form onSubmit={login}>
            <input
              type="email"
              className={`w-full p-3 mb-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              className={`w-full p-3 mb-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              className={`w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-neon-green text-black' : 'bg-blue-600 text-white'}`}
              type="submit"
            >
              Login
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Admin Dashboard
        </h2>
        <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Pending Transactions
        </h3>
        {transactions.length === 0 ? (
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No pending transactions.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <th>User</th>
                <th>Action</th>
                <th>Crypto</th>
                <th>Amount</th>
                <th>Fiat</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  <td>{tx.userId.slice(0, 6)}...</td>
                  <td>{tx.action}</td>
                  <td>{tx.crypto}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.fiat}</td>
                  <td>
                    <button
                      className="px-2 py-1 bg-green-500 text-white rounded mr-2"
                      onClick={() => handleAction(tx._id, 'accept')}
                    >
                      Accept
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleAction(tx._id, 'decline')}
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;