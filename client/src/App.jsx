import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import BuySell from './pages/BuySell';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/buy-sell" element={<BuySell />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}

export default App;