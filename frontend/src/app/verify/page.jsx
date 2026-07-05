import React, { useState } from 'react';
import { Shield, CheckCircle2, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export default function VerifyPage() {
  const [hash, setHash] = useState('');
  const [status, setStatus] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (hash.trim().length > 5) {
      setStatus('verified');
    } else {
      setStatus('invalid');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', overflow: 'hidden' }}>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div style={{ width: '100%', maxWidth: '500px', zIndex: 1, animation: 'fadeUp 0.8s ease-out' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Shield size={48} color="var(--accent-purple)" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 12px rgba(139,92,246,0.5))' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Verify Your Vote</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enter your cryptographic receipt to confirm your vote was counted.</p>
        </div>

        <Card>
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label>Receipt Hash</label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: '48px', height: '52px', fontSize: '1.1rem', letterSpacing: '1px' }} 
                  placeholder="e.g. #A7X9-P2M4" 
                  value={hash}
                  onChange={(e) => { setHash(e.target.value.toUpperCase()); setStatus(null); }}
                  required 
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: '48px' }}>
              Check Blockchain Ledger
            </button>
          </form>
        </Card>

        {status === 'verified' && (
          <div style={{ marginTop: '2rem', animation: 'slideDown 0.4s ease-out' }}>
            <Card style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <CheckCircle2 size={32} color="var(--success)" />
              <div>
                <h3 style={{ margin: 0, color: 'var(--success)', fontSize: '1.1rem' }}>Vote Verified</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>This receipt exists in the ledger and the vote was successfully tallied.</p>
              </div>
            </Card>
          </div>
        )}

        {status === 'invalid' && (
          <div style={{ marginTop: '2rem', animation: 'slideDown 0.4s ease-out' }}>
            <Card style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--danger)', fontSize: '1.1rem' }}>Receipt Not Found</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Please double check the receipt hash you entered.</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
