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
          ? 'bg-gradient-to-br from-dark-bg to-[#1A1A3E]'
          : 'bg-gradient-to-br from-light-bg to-[#E5E7EB]'
      }`}
    >
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="glass rounded-2xl p-8 max-w-lg w-full text-center"
        >
          <h1
            className={`text-5xl md:text-6xl font-extrabold mb-4 ${
              theme === 'dark' ? 'text-cyan' : 'text-text-light'
            }`}
          >
            FlashEx
          </h1>
          <p
            className={`text-lg md:text-xl mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Trade Crypto with Unmatched Speed and Style
          </p>
          <Link to="/auth">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-full text-lg font-semibold glow-button ${
                theme === 'dark'
                  ? 'bg-cyan text-dark-bg'
                  : 'bg-cyan text-light-bg'
              }`}
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