import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`p-4 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'} shadow-lg`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/">
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-neon-blue' : 'text-gray-800'}`}>
            FlashEx
          </h1>
        </Link>
        <div className="flex space-x-4">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:text-neon-blue' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Home
            </motion.button>
          </Link>
          {user && (
            <>
              <Link to="/buy-sell">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:text-neon-blue' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  Buy/Sell
                </motion.button>
              </Link>
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:text-neon-blue' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  Dashboard
                </motion.button>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:text-neon-blue' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    Admin
                  </motion.button>
                </Link>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}
                onClick={handleLogout}
              >
                Logout
              </motion.button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:text-neon-blue' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:text-neon-blue' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  Register
                </motion.button>
              </Link>
            </>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;