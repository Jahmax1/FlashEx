import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import BuySell from './pages/BuySell';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/buy-sell" element={<BuySell />} />
      </Routes>
    </Router>
  );
}

export default App;