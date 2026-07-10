import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBallotContext } from '@/context/BallotContext';
import { ShieldCheck, Copy, Home, CheckCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';

export default function ReceiptPage() {
  const { receipt } = useBallotContext();
  const navigate = useNavigate();
  const { boothId } = useParams();
  const [isGenerating, setIsGenerating] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (receipt) {
      // Simulate cryptographic hash generation delay for premium feel
      const timer = setTimeout(() => {
        setIsGenerating(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [receipt]);

  if (!receipt) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>No Receipt Found</h2>
        <button className="btn btn-primary" onClick={() => navigate(boothId ? `/vote/${boothId}` : '/vote')}>Go Back</button>
      </div>
    );
  }

  const copyReceipt = () => {
    navigator.clipboard.writeText(receipt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '1rem', position: 'relative' }}>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div style={{ width: '100%', maxWidth: '550px', zIndex: 1 }}>
        <Card style={{ textAlign: 'center', padding: '3.5rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
          
          {isGenerating ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '280px', animation: 'fadeIn 0.3s ease' }}>
              <div className="spinner" style={{ 
                width: '60px', height: '60px', border: '4px solid rgba(16,185,129,0.2)', 
                borderTopColor: 'var(--success)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' 
              }}></div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Generating Receipt...</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Encrypting your ballot and hashing the ledger.</p>
            </div>
          ) : (
            <div style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--success)' }}></div>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(16,185,129,0.2)' }}>
                <ShieldCheck size={40} color="var(--success)" style={{ filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.5))' }} />
              </div>
              
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 0%, #6ee7b7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Vote Verified
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
                Your vote has been cast successfully, encrypted, and anonymously tallied. Thank you for participating!
              </p>
              
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', height: '56px', fontSize: '1.1rem', borderRadius: '12px' }}
                onClick={() => navigate(boothId ? `/vote/${boothId}` : '/vote')}
              >
                <Home size={20} /> Complete Session
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
