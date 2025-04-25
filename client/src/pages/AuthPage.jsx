import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const AuthPage = () => {
  const { theme } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin ? { email, password } : { email, password, role };
      const res = await axios.post(`http://localhost:5000/api/auth${endpoint}`, payload);
      login(res.data.token, res.data.role);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-dark-bg to-[#1A1A3E]'
          : 'bg-gradient-to-br from-light-bg to-[#E5E7EB]'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass rounded-2xl p-8 max-w-md w-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2
              className={`text-3xl font-bold mb-6 flex items-center ${
                theme === 'dark' ? 'text-cyan' : 'text-text-light'
              }`}
            >
              {isLogin ? (
                <>
                  <FaSignInAlt className="mr-2" /> Login
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2" /> Register
                </>
              )}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  className={`w-full p-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white border-gray-600'
                      : 'bg-gray-100 text-text-light border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-cyan glow-button`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  className={`w-full p-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white border-gray-600'
                      : 'bg-gray-100 text-text-light border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-cyan glow-button`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              {!isLogin && (
                <div className="mb-4">
                  <select
                    className={`w-full p-3 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white border-gray-600'
                        : 'bg-gray-100 text-text-light border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-cyan glow-button`}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
              {error && (
                <p className="text-red-500 mb-4 text-sm">{error}</p>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full p-3 rounded-lg glow-button ${
                  theme === 'dark'
                    ? 'bg-cyan text-dark-bg'
                    : 'bg-cyan text-light-bg'
                } font-semibold`}
                type="submit"
              >
                {isLogin ? 'Login' : 'Register'}
              </motion.button>
            </form>
            <p
              className={`mt-4 text-center ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                className={`underline ${
                  theme === 'dark' ? 'text-cyan' : 'text-cyan'
                }`}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;