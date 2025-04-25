import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Header from '../components/Header';

const Landing = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-dark-bg to-gray-900'
          : 'bg-gradient-to-br from-light-bg to-gray-200'
      }`}
    >
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center backdrop-blur-md bg-white bg-opacity-10 rounded-xl p-8 shadow-xl"
        >
          <h1
            className={`text-5xl md:text-6xl font-extrabold mb-4 ${
              theme === 'dark' ? 'text-neon-blue' : 'text-gray-800'
            }`}
          >
            FlashEx
          </h1>
          <p
            className={`text-lg md:text-xl mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Trade Crypto with Lightning Speed
          </p>
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-full text-lg font-semibold ${
                theme === 'dark'
                  ? 'bg-neon-green text-black'
                  : 'bg-blue-600 text-white'
              } shadow-lg`}
            >
              Start Trading
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;