import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Technology from './pages/Technology';
import About from './pages/About';
import Auth from './pages/Auth';
import Subscription from './pages/Subscription';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30">
        <Navbar />

        <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/tech" element={<Technology />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/upgrade" element={<Subscription />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;