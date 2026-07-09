import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useKioskContext } from '@/context/KioskContext';
import { ShieldCheck, Timer, AlertTriangle } from 'lucide-react';

export default function VoteLayout() {
  const { activeStudent, kioskStatus, booths, roster } = useKioskContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { boothId } = useParams();
  const booth = booths?.find(b => b.id === boothId);
  const currentVoter = roster?.find(s => s.id === activeStudent);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    // Removed authentication redirect for anonymous voting
  }, [kioskStatus, activeStudent, navigate, location]);

  useEffect(() => {
    // Only run timer if they are actively voting
    if (kioskStatus === 'voting') {
      setTimeLeft(300); // Reset timer to 5 mins
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Session expires, kicked by context usually, but just in case:
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [kioskStatus]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isWarning = timeLeft < 60; // Less than 1 min

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Premium Secure Header */}
      {location.pathname !== '/vote' && (
        <header style={{ 
          background: 'rgba(6, 9, 19, 0.8)', 
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '8px', borderRadius: '10px' }}>
              <ShieldCheck size={24} color="#10b981" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Secure Terminal {booth ? `- ${booth.name}` : ''}
              </h2>
              {currentVoter ? (
                <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Voter: {currentVoter.name} ({currentVoter.grade})
                </span>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Session Verified</span>
              )}
            </div>
          </div>

          {kioskStatus === 'voting' && (
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', 
              background: isWarning ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)', 
              padding: '8px 16px', borderRadius: '20px',
              border: `1px solid ${isWarning ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
              color: isWarning ? 'var(--danger)' : 'var(--text-primary)',
              animation: isWarning ? 'pulse 2s infinite' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {isWarning ? <AlertTriangle size={18} /> : <Timer size={18} color="var(--text-secondary)" />}
              <span style={{ fontWeight: '700', fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '1px' }}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </header>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, position: 'relative' }}>
        <Outlet />
      </main>
      
    </div>
  );
}
