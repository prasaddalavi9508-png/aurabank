import React from 'react';
import { CreditCard } from 'lucide-react';

export default function Cards() {
  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <header className="header">
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>My Cards</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your physical and virtual cards.</p>
        </div>
      </header>
      
      <div className="grid-overview" style={{ marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(59,130,246,0.8), rgba(139,92,246,0.8))', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600 }}>AuraBank</span>
            <CreditCard />
          </div>
          <div style={{ fontSize: '1.25rem', letterSpacing: '2px', fontWeight: 500 }}>
            •••• •••• •••• 4242
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <div>
              <div style={{ opacity: 0.8, fontSize: '0.75rem' }}>Card Holder Name</div>
              <div style={{ fontWeight: 600 }}>Alex Doe</div>
            </div>
            <div>
              <div style={{ opacity: 0.8, fontSize: '0.75rem' }}>Expiry Date</div>
              <div style={{ fontWeight: 600 }}>04/28</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
