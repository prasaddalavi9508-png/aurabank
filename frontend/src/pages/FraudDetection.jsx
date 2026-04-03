import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  CheckCircle,
  Activity,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';

export default function FraudDetection({ transactions = [] }) {
  const [fraudSystemActive, setFraudSystemActive] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Analyze transactions for fraud-like patterns
  const analyzeTransactions = () => {
    const fraudPatterns = {
      highValue: false,
      suspiciousRecipients: false,
      frequentTransfers: false,
      detectedThreats: []
    };

    if (transactions && Array.isArray(transactions)) {
      // Check for high-value transfers
      const highValueTx = transactions.filter(tx => Math.abs(tx.amount) > 3000);
      if (highValueTx.length > 0) {
        fraudPatterns.highValue = true;
        fraudPatterns.detectedThreats.push(`${highValueTx.length} high-value transfer(s) detected`);
      }

      // Check for suspicious recipients
      const suspiciousKeywords = ['scammer', 'hacker', 'unknown', 'fraud'];
      const suspiciousTx = transactions.filter(tx => 
        tx.title && suspiciousKeywords.some(keyword => tx.title.toLowerCase().includes(keyword))
      );
      if (suspiciousTx.length > 0) {
        fraudPatterns.suspiciousRecipients = true;
        fraudPatterns.detectedThreats.push(`${suspiciousTx.length} suspicious recipient(s)`);
      }

      // Check for frequent transfers in short period
      if (transactions.length > 5) {
        fraudPatterns.frequentTransfers = true;
        fraudPatterns.detectedThreats.push('High transaction frequency detected');
      }
    }

    return fraudPatterns;
  };

  const patterns = analyzeTransactions();
  const threatCount = patterns.detectedThreats.length;
  const systemStatus = fraudSystemActive ? 'ACTIVE' : 'DISABLED';
  const protectionLevel = fraudSystemActive ? 'MAX' : 'NONE';

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
      {/* Page Header */}
      <header className="header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Security Sentinel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Advanced Fraud Detection & Protection System</p>
        </div>
      </header>

      {/* Main Status Panel */}
      <div className="glass-panel section-card animate-fade-in" style={{ animationDelay: '0.2s', marginBottom: '24px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>System Status</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Real-time threat monitoring and protection</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {fraudSystemActive ? (
              <ShieldCheck color="var(--success)" size={32} />
            ) : (
              <ShieldAlert color="var(--danger)" size={32} />
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Status Box */}
          <div style={{ background: fraudSystemActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: fraudSystemActive ? '1px solid var(--success)' : '1px solid var(--danger)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>Current Status</p>
            <h3 style={{ color: fraudSystemActive ? 'var(--success)' : 'var(--danger)', fontSize: '1.5rem', fontWeight: 'bold' }}>{systemStatus}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '8px' }}>
              {fraudSystemActive ? '✓ All protocols active' : '⚠ Protection disabled'}
            </p>
          </div>

          {/* Protection Level */}
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>Protection Tier</p>
            <h3 style={{ color: fraudSystemActive ? 'var(--accent-primary)' : 'var(--danger)', fontSize: '1.5rem', fontWeight: 'bold', transition: 'color 0.3s' }}>{protectionLevel}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '8px' }}>Active rules</p>
          </div>

          {/* Threat Detection */}
          <div style={{ background: threatCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: threatCount > 0 ? '1px solid var(--danger)' : '1px solid var(--success)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>Detected Threats</p>
            <h3 style={{ color: threatCount > 0 ? 'var(--danger)' : 'var(--success)', fontSize: '1.5rem', fontWeight: 'bold' }}>{threatCount}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '8px' }}>In recent activity</p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setFraudSystemActive(!fraudSystemActive)}
          style={{
            width: '100%',
            padding: '14px',
            background: fraudSystemActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: fraudSystemActive ? 'var(--danger)' : 'var(--success)',
            border: fraudSystemActive ? '1px solid var(--danger)' : '1px solid var(--success)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.8';
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
            e.target.style.transform = 'scale(1)';
          }}
        >
          {fraudSystemActive ? '🛡️ Disable Sentinel Protection' : '🔓 Enable Sentinel Protection'}
        </button>
      </div>

      {/* Fraud Rules Info */}
      <div className="glass-panel section-card animate-fade-in" style={{ animationDelay: '0.3s', marginBottom: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Active Protection Rules</h2>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: 'inherit',
              fontFamily: 'inherit'
            }}
          >
            {showDetails ? <EyeOff size={18} /> : <Eye size={18} />}
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Rule 1: High Value Transfers */}
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <AlertCircle color="var(--accent-primary)" size={20} />
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>High-Value Threshold</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>
              {fraudSystemActive ? '✓ Active' : '✗ Inactive'}
            </p>
            {showDetails && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                Transfers exceeding $3,000 require multi-factor authentication. Rule Status: {patterns.highValue ? '🚨 TRIGGERED' : '✓ Normal'}
              </p>
            )}
          </div>

          {/* Rule 2: Blacklisted Recipients */}
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <ShieldAlert color="var(--danger)" size={20} />
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Recipient Blacklist</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>
              {fraudSystemActive ? '✓ Active' : '✗ Inactive'}
            </p>
            {showDetails && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                Blocks transfers to known fraud accounts (scammer, hacker, etc). Rule Status: {patterns.suspiciousRecipients ? '🚨 TRIGGERED' : '✓ Normal'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Activity */}
      <div className="glass-panel section-card animate-fade-in" style={{ animationDelay: '0.4s', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Activity color="var(--accent-primary)" size={24} />
          <h2 style={{ fontSize: '1.25rem' }}>Monitored Activity</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>Total Transactions Scanned</p>
            <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{transactions ? transactions.length : 0}</h3>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>Threats Intercepted</p>
            <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: threatCount > 0 ? 'var(--danger)' : 'var(--success)' }}>{threatCount}</h3>
          </div>
        </div>

        {threatCount > 0 && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '12px', padding: '16px' }}>
            <h4 style={{ color: 'var(--danger)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} /> Active Threats
            </h4>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              {patterns.detectedThreats.map((threat, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>• {threat}</li>
              ))}
            </ul>
          </div>
        )}

        {threatCount === 0 && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--success)' }}>
              <CheckCircle size={20} />
              <span>All transactions appear normal</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
