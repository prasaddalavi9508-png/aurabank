import React from 'react';

export default function Investments() {
  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <header className="header">
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Investments</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your portfolio performance.</p>
        </div>
      </header>
      
      <div className="glass-panel" style={{ padding: '24px', minHeight: '400px' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '100px' }}>
          Interactive portfolio charts and asset list will appear here.
        </p>
      </div>
    </div>
  );
}
