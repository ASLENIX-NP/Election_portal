import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { KeyRound, Vote } from 'lucide-react';

export default function VoteLogin() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy login action
    navigate('/vote/ballot');
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', overflow: 'hidden' }}>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div style={{ width: '100%', maxWidth: '420px', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', animation: 'slideDown 0.8s ease-out' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)' }}>
            <Vote size={40} color="#10b981" style={{ filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.5))' }} />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #fff 0%, #6ee7b7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Voter Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Enter your secure PIN to cast your vote</p>
        </div>
        
        <div style={{ animation: 'fadeUp 0.8s ease-out 0.2s backwards' }}>
          <Card>
            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                  Secure Voter PIN
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••" 
                    style={{ paddingLeft: '48px', height: '52px', fontSize: '1.1rem', letterSpacing: '0.2em' }} 
                    required 
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', height: '52px', fontSize: '1rem', fontWeight: 600, background: '#10b981', boxShadow: '0 4px 20px rgba(16,185,129,0.3)', border: 'none', transition: 'all 0.3s ease' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(16,185,129,0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,185,129,0.3)'; }}
              >
                Authenticate & Vote
              </button>
              
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
                  Hint: Use any PIN (e.g. 1234)
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
