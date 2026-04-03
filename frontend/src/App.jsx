import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowRightLeft,
  WalletCards,
  LineChart,
  Settings as SettingsIcon,
  LogOut,
  Shield
} from 'lucide-react';
import './index.css';

import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Investments from './pages/Investments';
import Settings from './pages/Settings';
import FraudDetection from './pages/FraudDetection';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chatbot from './components/Chatbot';

function Sidebar({ onLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="sidebar animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="logo-area">
        <div className="logo-icon"><LayoutDashboard /></div>
        <span>AuraBank</span>
      </div>

      <nav className="nav-links" style={{ marginTop: '32px' }}>
        <Link to="/" className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>
          <LayoutDashboard /> Dashboard
        </Link>
        <Link to="/transactions" className={`nav-item ${currentPath === '/transactions' ? 'active' : ''}`}>
          <ArrowRightLeft /> Transactions
        </Link>
        <Link to="/cards" className={`nav-item ${currentPath === '/cards' ? 'active' : ''}`}>
          <WalletCards /> Cards
        </Link>
        <Link to="/investments" className={`nav-item ${currentPath === '/investments' ? 'active' : ''}`}>
          <LineChart /> Investments
        </Link>
        <Link to="/fraud-detection" className={`nav-item ${currentPath === '/fraud-detection' ? 'active' : ''}`}>
          <Shield /> Fraud Detection
        </Link>
      </nav>

      <nav className="nav-links" style={{ marginTop: 'auto' }}>
        <Link to="/settings" className={`nav-item ${currentPath === '/settings' ? 'active' : ''}`}>
          <SettingsIcon /> Settings
        </Link>
        <button
          onClick={onLogout}
          className="nav-item"
          style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
        >
          <LogOut /> Logout
        </button>
      </nav>
    </aside>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('Alex Doe');
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const fetchGlobalData = async (userParam) => {
    try {
      const [profileRes, txRes] = await Promise.all([
        fetch(`http://localhost:3001/api/profile?user=${encodeURIComponent(userParam)}`),
        fetch(`http://localhost:3001/api/transactions?user=${encodeURIComponent(userParam)}`)
      ]);
      if (profileRes.ok) setProfile(await profileRes.json());
      if (txRes.ok) setTransactions(await txRes.json());
    } catch (err) {
      console.error("DB Fetch error:", err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchGlobalData(currentUser);
    }
  }, [isAuthenticated, currentUser]);

  const handleAddTransaction = async (newTx) => {
    try {
      const response = await fetch('http://localhost:3001/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTx, user: currentUser })
      });
      const data = await response.json();

      if (!response.ok && data.error === "FRAUD_DETECTED") {
        return { success: false, fraudDetected: true, message: data.message };
      }

      if (data.success) {
        await fetchGlobalData(currentUser);
        return { success: true };
      } else {
        alert("Failed to save transaction to DB!");
        return { success: false };
      }
    } catch (err) {
      console.error(err);
      alert("Network error updating database.");
      return { success: false };
    }
  };

  const handleLogin = (name) => {
    setCurrentUser(name || 'User');
    setIsAuthenticated(true);
  };
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <div className="dashboard-container">
          <Sidebar onLogout={handleLogout} />
          <main className="main-content">
            {loadingInitial ? (
              <div style={{ color: 'var(--text-secondary)' }}>Loading Database State...</div>
            ) : (
              <Routes>
                <Route path="/" element={<Dashboard currentUser={currentUser} profile={profile} transactions={Array.isArray(transactions) ? transactions.slice(0, 5) : []} onAddTransaction={handleAddTransaction} />} />
                <Route path="/transactions" element={<Transactions transactions={Array.isArray(transactions) ? transactions : []} />} />
                <Route path="/cards" element={<Cards />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/fraud-detection" element={<FraudDetection transactions={Array.isArray(transactions) ? transactions : []} />} />
                <Route path="/settings" element={<Settings currentUser={currentUser} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </main>
          <Chatbot />
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
