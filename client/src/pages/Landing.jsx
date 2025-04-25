import { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Landing = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-neon-blue' : 'text-gray-800'}`}>
          FlashEx
        </h1>
        <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Trade Crypto Instantly
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/buy-sell">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className={`px-6 py-3 rounded-lg ${theme === 'dark' ? 'bg-neon-green text-black' : 'bg-blue-600 text-white'}`}
            >
              Start Trading
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`px-6 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;