import React, { useEffect } from 'react';
import { X, MessageSquareQuote, CheckCircle, Target, Award } from 'lucide-react';

export default function CandidateModal({ candidate, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (candidate) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [candidate, onClose]);

  if (!candidate) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(6, 9, 19, 0.8)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem',
      animation: 'fadeIn 0.3s ease-out'
    }}
    onClick={onClose}
    >
      <div 
        style={{ 
          width: '100%', maxWidth: '600px', 
          background: 'var(--surface-color)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative', 
          overflow: 'hidden',
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '20px', right: '20px',
            background: 'rgba(0,0,0,0.2)', border: 'none',
            borderRadius: '50%', width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', cursor: 'pointer', zIndex: 10,
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
        >
          <X size={20} />
        </button>

        <div style={{ position: 'relative' }}>
          <div style={{ 
            height: '160px', 
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(16,185,129,0.2) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}></div>
          
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random&color=fff&size=120`} 
            alt={candidate.name}
            style={{ 
              width: '100px', height: '100px', borderRadius: '24px', 
              objectFit: 'cover', 
              border: '4px solid var(--surface-color)', 
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              position: 'absolute',
              bottom: '-30px',
              left: '32px'
            }}
          />
        </div>

        <div style={{ padding: '40px 32px 32px 32px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{candidate.name}</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59,130,246,0.1)', color: 'var(--accent-cyan)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
              <Award size={16} /> Official Candidate for {candidate.position}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              <MessageSquareQuote size={18} />
              Campaign Slogan
            </h3>
            <p style={{ 
              fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--text-primary)', 
              background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', 
              borderLeft: '4px solid var(--accent-cyan)', margin: 0,
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
            }}>
              "{candidate.slogan}"
            </p>
          </div>

          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              <Target size={18} /> Platform & Goals
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {candidate.platform.map((point, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  <div style={{ marginTop: '4px', color: 'var(--success)' }}>
                    <CheckCircle size={18} />
                  </div>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '32px', padding: '14px', justifyContent: 'center', fontSize: '1.05rem', borderRadius: '12px' }}
            onClick={onClose}
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
