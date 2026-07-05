import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBallotContext } from '../../../context/BallotContext';
import { ShieldCheck, Copy, Home } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export default function ReceiptPage() {
  const { receipt } = useBallotContext();
  const navigate = useNavigate();

  if (!receipt) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <h2>No Receipt Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/vote')}>Go Back</button>
      </div>
    );
  }

  const copyReceipt = () => {
    navigator.clipboard.writeText(receipt);
    alert('Receipt copied to clipboard!');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', overflow: 'hidden' }}>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div style={{ width: '100%', maxWidth: '500px', zIndex: 1, animation: 'fadeUp 0.8s ease-out' }}>
        <Card style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(16,185,129,0.2)' }}>
            <ShieldCheck size={40} color="var(--success)" style={{ filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.5))' }} />
          </div>
          
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Vote Cast Successfully</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your vote is anonymous and secure. Please save your cryptographic receipt to verify your vote was tallied.</p>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>OFFICIAL RECEIPT HASH</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--accent-cyan)' }}>
                {receipt}
              </span>
              <button 
                onClick={copyReceipt}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}
                title="Copy Receipt"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
          
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center', height: '48px' }}
            onClick={() => navigate('/')}
          >
            <Home size={18} /> Return to Home
          </button>
        </Card>
      </div>
    </div>
  );
}
