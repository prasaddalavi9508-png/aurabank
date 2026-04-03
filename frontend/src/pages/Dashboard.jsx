import React, { useState } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Target,
  ArrowUpRight,
  ShoppingCart,
  Coffee,
  Smartphone,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

const getIconForCategory = (category) => {
  switch(category) {
    case 'Electronics': return <Smartphone size={20} />;
    case 'Groceries': return <ShoppingCart size={20} />;
    case 'Entertainment': return <Coffee size={20} />;
    case 'Income': return <Briefcase size={20} />;
    default: return <CreditCard size={20} />;
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default function Dashboard({ currentUser, profile, transactions, onAddTransaction }) {
  // Quick Transfer State
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [customRecipient, setCustomRecipient] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    let finalRecipient = selectedRecipient;
    if (selectedRecipient === 'custom') {
      if (!customRecipient.trim()) return alert("Please type a name for the new recipient.");
      finalRecipient = customRecipient.trim();
    } else if (!selectedRecipient) {
      return alert('Please select a recipient first.');
    }

    if (!transferAmount || isNaN(transferAmount) || Number(transferAmount) <= 0) return alert('Please enter a valid amount.');
    
    setIsTransferring(true);
    // Push DB via API in App
    const response = await onAddTransaction({
      title: `Transfer to ${finalRecipient}`,
      recipient: finalRecipient,
      date: new Date().toISOString().split('T')[0],
      amount: -Number(transferAmount),
      category: 'Transfer'
    });

    setIsTransferring(false);
    if (response && response.success) {
      // Success feedback is handled dynamically by app state refresh, just clear form
      setTransferAmount('');
      setSelectedRecipient(null);
      setCustomRecipient('');
    }
  };

  if (!profile) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--danger)' }}>
      <h2>Error: Profile Failed to Load</h2>
      <p>There was an issue communicating with the database or fetching your profile data.</p>
    </div>
  );

  return (
    <>
      <header className="header animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {currentUser}!</p>
        </div>
        <div className="user-info">
          <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>DB Connected</span>
          </div>
          <Link to="/settings" style={{ textDecoration: 'none' }}>
            <div className="avatar" style={{ cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} title="Go to Settings">
              {currentUser.charAt(0).toUpperCase()}
            </div>
          </Link>
        </div>
      </header>

      {/* Top Cards */}
      <div className="grid-overview animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span>Total Balance</span>
            <div className="stat-icon"><DollarSign size={18}/></div>
          </div>
          <div className="stat-value">{formatCurrency(profile.totalBalance)}</div>
          <div className="stat-trend trend-up">
            <TrendingUp size={16}/> <span>+2.4% this month</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span>Income</span>
            <div className="stat-icon"><ArrowUpRight size={18} style={{color: 'var(--success)'}}/></div>
          </div>
          <div className="stat-value">{formatCurrency(profile.monthlyIncome)}</div>
          <div className="stat-trend trend-up">
            <TrendingUp size={16}/> <span>+1.2%</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span>Expenses</span>
            <div className="stat-icon"><CreditCard size={18} style={{color: 'var(--danger)'}}/></div>
          </div>
          <div className="stat-value">{formatCurrency(profile.monthlyExpenses)}</div>
          <div className="stat-trend trend-down">
            <TrendingDown size={16}/> <span>+5.1%</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span>Savings</span>
            <div className="stat-icon"><Target size={18} style={{color: 'var(--accent-primary)'}}/></div>
          </div>
          <div className="stat-value">{formatCurrency(profile.totalSavings)}</div>
          <div className="stat-trend trend-up">
            <TrendingUp size={16}/> <span>Target: 80%</span>
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div className="grid-details animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="glass-panel section-card">
          <h2 className="section-header">Recent Transactions</h2>
          <div className="transaction-list">
            {transactions.map(tx => (
              <div className="transaction-item" key={tx.id}>
                <div className="tx-info">
                  <div className="tx-icon">
                    {getIconForCategory(tx.category)}
                  </div>
                  <div className="tx-details">
                    <span className="tx-title">{tx.title}</span>
                    <span className="tx-category">{tx.date} • {tx.category}</span>
                  </div>
                </div>
                <div className={`tx-amount ${tx.amount > 0 ? 'positive' : ''}`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel section-card">
          <h2 className="section-header">Quick Transfer</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {Array.from(new Set(
                (transactions || [])
                  .filter(tx => tx.title && tx.title.startsWith('Transfer to '))
                  .map(tx => tx.title.replace('Transfer to ', ''))
              )).slice(0, 3).map((name, i) => {
                const initials = name.substring(0, 2).toUpperCase();
                return (
                <div 
                  key={i} 
                  onClick={() => setSelectedRecipient(name)}
                  className="avatar" 
                  title={name}
                  style={{ 
                    background: selectedRecipient === name ? 'var(--accent-primary)' : 'var(--bg-card)', 
                    color: selectedRecipient === name ? 'white' : 'inherit',
                    border: selectedRecipient === name ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)', 
                    width: 48, 
                    height: 48, 
                    boxShadow: selectedRecipient === name ? '0 0 12px var(--accent-glow)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                  {initials}
                </div>
              )})}
              <div 
                className="avatar" 
                onClick={() => setSelectedRecipient('custom')}
                style={{ 
                  background: selectedRecipient === 'custom' ? 'rgba(255,255,255,0.1)' : 'transparent', 
                  border: selectedRecipient === 'custom' ? '1px solid white' : '1px dashed var(--border-color)', 
                  width: 48, height: 48, boxShadow: 'none', cursor: 'pointer' 
                }}>
                +
              </div>
            </div>
            
            {selectedRecipient === 'custom' && (
              <div style={{ marginTop: '8px' }}>
                <input 
                  type="text" 
                  value={customRecipient}
                  onChange={(e) => setCustomRecipient(e.target.value)}
                  placeholder="Recipient Name" 
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', outline: 'none' }}
                />
              </div>
            )}

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>$</span>
              <input 
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0.00"
                style={{ fontSize: '1.5rem', fontWeight: 600, background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', paddingLeft: '8px' }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>USD</span>
            </div>
            
            <button 
              onClick={() => handleTransfer()} 
              className="action-button primary" 
              style={{ width: '100%', marginTop: '16px' }}
              disabled={isTransferring}
            >
              {isTransferring ? 'Processing...' : 'Send Money'}
            </button>
          </div>
        </div>

      </div>

    </>
  );
}
