import { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const LandingPage = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Debug logs
  console.log('LandingPage: theme =', theme);
  console.log('LandingPage: navigate =', typeof navigate);

  // Fallback if theme is undefined
  const safeTheme = theme || 'dark';

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        safeTheme === 'dark'
          ? 'bg-gradient-to-br from-dark-bg to-[#1A1A3E]'
          : 'bg-gradient-to-br from-light-bg to-[#E5E7EB]'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass rounded-2xl p-8 max-w-lg w-full text-center"
      >
        <h1
          className={`text-4xl font-bold mb-4 ${
            safeTheme === 'dark' ? 'text-cyan' : 'text-text-light'
          }`}
        >
          Welcome to FlashEx
        </h1>
        <p
          className={`mb-6 ${
            safeTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Trade crypto with lightning speed and futuristic style. Join the revolution now!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-lg glow-button ${
            safeTheme === 'dark'
              ? 'bg-cyan text-dark-bg'
              : 'bg-cyan text-light-bg'
          } font-semibold`}
          onClick={() => {
            console.log('Navigating to /auth');
            navigate('/auth');
          }}
        >
          Start Trading
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingPage;