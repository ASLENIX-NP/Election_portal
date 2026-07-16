import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskContext } from '@/context/KioskContext';
import { Vote, ArrowRight, ArrowLeft, Shield } from 'lucide-react';

export default function VoterLogin() {
  const { booths } = useKioskContext();
  const navigate = useNavigate();
  const [selectedBooth, setSelectedBooth] = useState(booths[0]?.id || 'booth-01');

  const handleStart = (e) => {
    e.preventDefault();
    navigate(`/vote/${selectedBooth}`);
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', overflow: 'hidden', backgroundColor: '#ffffff' }}>
      
      {/* Very Subtle Background Glows for Depth on White */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(52,211,153,0.03) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <button 
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#64748b', cursor: 'pointer', transition: 'all 0.3s ease', fontWeight: 600, zIndex: 20 }}
        onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
      >
        <ArrowLeft size={18} /> <span>Back</span>
      </button>

      <div style={{ width: '100%', maxWidth: '440px', zIndex: 1, animation: 'fadeUp 0.8s ease-out' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '24px', background: '#ecfdf5', border: '1px solid #a7f3d0', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.1)' }}>
            <Vote size={40} color="#10b981" />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem', color: '#0f172a' }}>
            Voting Kiosk
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Select your assigned voting terminal</p>
        </div>
        
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05), 0 0 20px rgba(0,0,0,0.02)' }}>
          <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="form-group" style={{ position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', color: '#334155', fontSize: '0.95rem', fontWeight: 600 }}>
                Assigned Booth
              </label>
              <div style={{ position: 'relative' }}>
                <select 
                  value={selectedBooth} 
                  onChange={(e) => setSelectedBooth(e.target.value)}
                  className="premium-input"
                  style={{ 
                    padding: '0 24px', 
                    height: '60px',
                    borderRadius: '12px', 
                    background: '#f8fafc', 
                    color: '#0f172a', 
                    border: '2px solid #e2e8f0', 
                    outline: 'none', 
                    fontSize: '1.1rem', 
                    width: '100%', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.1)'; e.target.style.background = '#ffffff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
                >
                  {booths && booths.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.location})</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Shield size={20} color="#10b981" />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', height: '60px', marginTop: '1rem', fontSize: '1.15rem', fontWeight: 700, borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', boxShadow: '0 10px 25px rgba(16,185,129,0.25)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', transition: 'all 0.3s ease', cursor: 'pointer' }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(16,185,129,0.35)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(16,185,129,0.25)'; }}
            >
              Launch Terminal <ArrowRight size={22} />
            </button>
          </form>

          <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#047857', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Shield size={16} color="#10b981" />
              Terminal requires moderator authorization.
            </p>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        select.premium-input {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
        select.premium-input option {
          background-color: #ffffff;
          color: #0f172a;
        }
      `}} />
    </div>
  );
}
