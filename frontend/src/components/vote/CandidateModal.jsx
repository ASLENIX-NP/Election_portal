import React from 'react';
import { X, UserCircle, MessageSquareQuote } from 'lucide-react';
import { Card } from '../ui/Card';

export default function CandidateModal({ candidate, onClose }) {
  if (!candidate) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '500px', animation: 'fadeUp 0.3s ease-out' }}>
        <Card style={{ position: 'relative', overflow: 'hidden' }}>
          
          <button 
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '50%', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-primary)', cursor: 'pointer', zIndex: 2
            }}
          >
            <X size={18} />
          </button>

          <div style={{ 
            background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(236,72,153,0.2) 100%)', 
            margin: '-24px -24px 24px -24px', 
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <UserCircle size={80} color="#f8fafc" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))', marginBottom: '16px' }} />
            <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>{candidate.name}</h2>
            <div className="badge active" style={{ marginTop: '8px' }}>Running for {candidate.position}</div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: 'var(--accent-cyan)', marginBottom: '12px' }}>
              <MessageSquareQuote size={20} />
              Campaign Slogan
            </h3>
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--accent-cyan)' }}>
              "{candidate.slogan}"
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-pink)', marginBottom: '12px' }}>Platform & Goals</h3>
            <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              {candidate.platform.map((point, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>{point}</li>
              ))}
            </ul>
          </div>
          
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '24px', padding: '12px', justifyContent: 'center' }}
            onClick={onClose}
          >
            Close Profile
          </button>
        </Card>
      </div>
    </div>
  );
}
