import React from 'react';

export default function Settings({ currentUser }) {
  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <header className="header">
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Settings</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your profile and preferences.</p>
        </div>
      </header>
      
      <div className="glass-panel" style={{ padding: '32px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Profile Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" defaultValue={currentUser || "Alex Doe"} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" defaultValue={`${(currentUser || "alex").toLowerCase().split(' ')[0]}@example.com`} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Preferences</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Notification and security settings will appear here.</p>
        </div>

      </div>
    </div>
  );
}
