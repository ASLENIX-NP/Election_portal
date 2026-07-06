import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { KeyRound, Vote, AlertCircle, ArrowLeft } from 'lucide-react';
import { useKioskContext } from '@/context/KioskContext';

export default function VoteLogin() {
  const navigate = useNavigate();
  const { authenticateVoter } = useKioskContext();
  const [inputId, setInputId] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (authenticateVoter(inputId.toUpperCase())) {
      setError('');
      navigate('/vote/ballot');
    } else {
      setError('Invalid ID or voting has not been enabled for you. Please see the Moderator.');
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', overflow: 'hidden' }}>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <button 
        onClick={() => navigate('/')}
        className="btn btn-secondary"
        style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10, padding: '8px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div style={{ width: '100%', maxWidth: '420px', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', animation: 'slideDown 0.8s ease-out' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)' }}>
            <Vote size={40} color="#10b981" style={{ filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.5))' }} />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #fff 0%, #6ee7b7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Voting Kiosk
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Enter your Student ID to begin</p>
        </div>
        
        <div style={{ animation: 'fadeUp 0.8s ease-out 0.2s backwards' }}>
          <Card>
            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. S-1001" 
                    value={inputId}
                    onChange={(e) => { setInputId(e.target.value); setError(''); }}
                    style={{ paddingLeft: '48px', height: '52px', fontSize: '1.25rem', letterSpacing: '2px', textTransform: 'uppercase' }} 
                    required 
                  />
                </div>
              </div>

              {error && (
                <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', height: '52px', fontSize: '1rem', fontWeight: 600, background: '#10b981', boxShadow: '0 4px 20px rgba(16,185,129,0.3)', border: 'none', transition: 'all 0.3s ease', marginTop: '1rem' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(16,185,129,0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,185,129,0.3)'; }}
              >
                Authenticate & Vote
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
