import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Coffee, Smartphone, Briefcase, CreditCard } from 'lucide-react';

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

export default function Transactions({ transactions }) {
  const [searchQuery, setSearchQuery] = useState('');


  const filteredTransactions = transactions.filter(tx => 
    tx.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tx.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <header className="header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Transactions</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View and search all your financial activity.</p>
        </div>
      </header>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search by name or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', backdropFilter: 'blur(12px)' }} 
          />
        </div>
      </div>
      
      {/* Transactions List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        {filteredTransactions.length === 0 ? (
           <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>No transactions found for "{searchQuery}".</p>
        ) : (
          <div className="transaction-list">
            {filteredTransactions.map(tx => (
              <div 
                className="transaction-item" 
                key={tx.id}
                style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="tx-info" style={{ gap: '20px' }}>
                  <div className="tx-icon" style={{ background: 'var(--bg-dark)', width: '48px', height: '48px' }}>
                    {getIconForCategory(tx.category)}
                  </div>
                  <div className="tx-details">
                    <span className="tx-title" style={{ fontSize: '1.1rem' }}>{tx.title}</span>
                    <span className="tx-category">{tx.date} • {tx.category}</span>
                  </div>
                </div>
                <div className={`tx-amount ${tx.amount > 0 ? 'positive' : ''}`} style={{ fontSize: '1.1rem' }}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
