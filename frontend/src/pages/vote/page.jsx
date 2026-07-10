import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Vote, ArrowLeft, ArrowRight, KeyRound, AlertCircle } from 'lucide-react';
import { useKioskContext } from '@/context/KioskContext';

export default function VoteLogin() {
  const navigate = useNavigate();
  const { boothId } = useParams();
  const { authenticateVoter, activeStudent } = useKioskContext();
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  React.useEffect(() => {
    const checkAuth = () => {
      setIsAuthorized(!!localStorage.getItem(`activeStudent_${boothId}`));
    };
    checkAuth();
    
    // Check periodically in case localStorage events don't fire properly or for same-browser testing
    const interval = setInterval(checkAuth, 1000);
    window.addEventListener('storage', checkAuth);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAuth);
    };
  }, [boothId]);

  const handleStart = (e) => {
    e.preventDefault();
    
    if (authenticateVoter(boothId)) {
      navigate(`/vote/${boothId}/ballot`);
    } else {
      setError('Session not authorized. Please verify with the moderator.');
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', overflow: 'hidden', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '5%', left: '10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '5%', right: '10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <button 
        onClick={() => navigate('/')}
        className="btn btn-secondary"
        style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10, padding: '10px 20px', background: 'rgba(0,0,0,0.02)', color: 'var(--text-secondary)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)', borderRadius: '12px', transition: 'all 0.3s ease' }}
        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div style={{ width: '100%', maxWidth: '460px', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', animation: 'slideDown 0.8s ease-out' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '88px', height: '88px', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.15)' }}>
            <Vote size={44} color="#10b981" style={{ filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.3))' }} />
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem', background: 'linear-gradient(135deg, #020617 0%, #334155 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Voting Kiosk
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem' }}>Welcome to the electronic voting terminal.</p>
        </div>
        
        <div style={{ animation: 'fadeUp 0.8s ease-out 0.2s backwards' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.7)', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', backdropFilter: 'blur(20px)' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.5 }}>
                {isAuthorized ? 'Your session has been authorized. You may now proceed.' : 'Please wait for the moderator to authorize your session.'}
              </p>
              
              <form onSubmit={handleStart}>
                <div style={{ marginBottom: '2rem' }}>
                  {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.9rem', marginTop: '16px', justifyContent: 'center', fontWeight: 600, background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', animation: 'slideDown 0.3s ease-out' }}>
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit"
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', height: '60px', fontSize: '1.2rem', fontWeight: 700, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 8px 25px rgba(16,185,129,0.3)', border: 'none', borderRadius: '16px', transition: 'all 0.3s ease', display: 'flex', gap: '10px', alignItems: 'center', color: '#ffffff' }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(16,185,129,0.4)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(16,185,129,0.3)'; }}
                >
                  Unlock Secure Ballot <ArrowRight size={22} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
