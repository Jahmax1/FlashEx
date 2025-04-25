import { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className={`p-4 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'} flex justify-end`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`p-2 rounded-full glow-button ${
          theme === 'dark' ? 'bg-gray-800 text-cyan' : 'bg-gray-200 text-text-light'
        }`}
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
      </motion.button>
    </header>
  );
};

export default Header;