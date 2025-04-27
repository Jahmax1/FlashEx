import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BuySell from './pages/BuySell';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  console.log('App: Rendering routes');
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <LandingPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/auth"
            element={
              <ErrorBoundary>
                <AuthPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ErrorBoundary>
                <UserDashboard />
              </ErrorBoundary>
            }
          />
          <Route
            path="/buy-sell"
            element={
              <ErrorBoundary>
                <BuySell />
              </ErrorBoundary>
            }
          />
          <Route
            path="/admin"
            element={
              <ErrorBoundary>
                <AdminDashboard />
              </ErrorBoundary>
            }
          />
          <Route
            path="*"
            element={
              <ErrorBoundary>
                <div
                  className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-bg to-[#1A1A3E]"
                >
                  <div className="glass rounded-2xl p-8 max-w-lg w-full text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">
                      404 - Page Not Found
                    </h2>
                    <button
                      className="px-4 py-2 rounded-lg glow-button bg-cyan text-dark-bg font-semibold"
                      onClick={() => window.location.href = '/'}
                    >
                      Go to Home
                    </button>
                  </div>
                </div>
              </ErrorBoundary>
            }
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;