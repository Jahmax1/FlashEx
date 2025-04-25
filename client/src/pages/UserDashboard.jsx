import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Web3 from 'web3';
import { ThemeContext } from '../context/ThemeContext';

const UserDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const [walletAddress, setWalletAddress] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (walletAddress) {
        try {
          const res = await axios.get('http://localhost:5000/api/transactions/pending');
          setTransactions(res.data.filter((tx) => tx.userId === walletAddress));
        } catch (error) {
          alert('Failed to load transactions.');
        }
      }
    };
    fetchTransactions();
  }, [walletAddress]);

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
    <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          User Dashboard
        </h2>
        {!walletAddress ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`px-6 py-3 rounded-lg ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}
            onClick={connectWallet}
          >
            Connect Wallet
          </motion.button>
        ) : (
          <div>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
            <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Transaction History
            </h3>
            {transactions.length === 0 ? (
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No transactions yet.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <th>Action</th>
                    <th>Crypto</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      <td>{tx.action}</td>
                      <td>{tx.crypto}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboard;