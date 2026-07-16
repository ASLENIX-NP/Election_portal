import React, { useState } from 'react';
import { RefreshCcw, Search, CheckCircle2, ShieldAlert, FileKey, AlertCircle, MonitorPlay, GraduationCap, XCircle, AlertTriangle } from 'lucide-react';
import { useKioskContext } from '@/context/KioskContext';
import '../mod.css';

export default function ModResetPage() {
  const { roster, logAction, isLockdown, enableVoting, booths } = useKioskContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const [generatedPass, setGeneratedPass] = useState('');
  const [selectedBooth, setSelectedBooth] = useState('');
  const [boothError, setBoothError] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    setSearchResult(null);
    setGeneratedPass('');
    setBoothError(false);
    
    if (isLockdown) {
      setError('System is currently in Emergency Lockdown. Resets are disabled.');
      return;
    }

    const query = searchQuery.trim().toUpperCase();
    if (!query) return;

    const student = roster.find(s => s.id.toUpperCase() === query || s.name.toUpperCase() === query);
    
    if (!student) {
      setError(`No student matches "${searchQuery}". Check for typos.`);
    } else {
      setSearchResult(student);
    }
  };

  const handleIssueOverride = () => {
    if (searchResult.status === 'voted') {
      setError('Student has already voted. Override passes cannot be issued.');
      return;
    }
    if (!selectedBooth) {
      setBoothError(true);
      return;
    }

    enableVoting(searchResult.id, selectedBooth);
    setGeneratedPass('AUTHORIZED');
    setBoothError(false);
    logAction('warning', `Issued Terminal Override for student ${searchResult.name} (${searchResult.id})`, 'Moderator');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ padding: '10px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '14px', display: 'flex', boxShadow: '0 4px 12px rgba(245,158,11,0.25)' }}>
              <RefreshCcw size={24} color="#fff" />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Credential Reset
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
            Issue temporary override passes for lost or forgotten credentials.
          </p>
        </div>
        {/* Warning badge */}
        <div style={{ padding: '8px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} color="#f59e0b" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b' }}>Privileged Action</span>
        </div>
      </div>

      {/* Lockdown Banner */}
      {isLockdown && (
        <div style={{ padding: '1rem 1.25rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', borderRadius: '10px', display: 'flex' }}>
            <ShieldAlert size={20} color="#ef4444" />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#ef4444', fontSize: '0.9rem' }}>LOCKDOWN ACTIVE — Resets Disabled</p>
            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>Credential resets are suspended during emergency lockdown.</p>
          </div>
        </div>
      )}

      {/* ─── Main Grid ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.25rem', alignItems: 'start' }}>
        
        {/* Left: Search Panel */}
        <div className="mod-panel">
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} color="#3b82f6" /> Lookup Voter
            </h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <form onSubmit={handleSearch}>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  placeholder="Enter Name or ID (e.g., PASS-1001)" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setError(''); }}
                  disabled={isLockdown}
                  style={{ 
                    width: '100%', padding: '12px 12px 12px 40px', 
                    background: '#fff', border: '2px solid var(--border-color)', borderRadius: '10px',
                    outline: 'none', color: '#0f172a', fontSize: '0.9rem', fontFamily: 'inherit',
                    fontWeight: 500, transition: 'border-color 0.2s ease',
                    opacity: isLockdown ? 0.5 : 1
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#f59e0b'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLockdown}
                style={{ 
                  width: '100%', padding: '12px', background: '#0f172a', color: '#fff', 
                  border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem',
                  cursor: isLockdown ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.15)', transition: 'all 0.2s ease',
                  opacity: isLockdown ? 0.5 : 1
                }}
              >
                <Search size={16} /> Search Roster
              </button>
            </form>

            {error && (
              <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(239,68,68,0.05)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.12)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <AlertCircle size={16} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>{error}</span>
              </div>
            )}

            {/* Instructions */}
            {!searchResult && !error && (
              <div style={{ marginTop: '1.5rem', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>How it works:</p>
                <ol style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.8 }}>
                  <li>Search for the voter by Name or ID</li>
                  <li>Verify their identity visually</li>
                  <li>Select the target terminal</li>
                  <li>Issue an override pass</li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Right: Result Panel */}
        {searchResult ? (
          <div className="mod-panel">
            {/* Status bar */}
            <div style={{ height: '3px', background: searchResult.status === 'voted' ? '#ef4444' : '#f59e0b' }}></div>
            
            <div style={{ padding: '1.5rem' }}>
              {/* Student Info */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ 
                  width: '56px', height: '56px', borderRadius: '14px', 
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(245,158,11,0.25)', flexShrink: 0
                }}>
                  <span style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 800 }}>{searchResult.name.charAt(0)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{searchResult.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                        <GraduationCap size={14} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{searchResult.grade}</span>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace', color: '#f59e0b' }}>{searchResult.id}</span>
                      </div>
                    </div>
                    {searchResult.status === 'voted' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.12)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        <CheckCircle2 size={12} /> Voted
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(16,185,129,0.07)', color: '#10b981', border: '1px solid rgba(16,185,129,0.12)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }}></span> Eligible
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0 0 1.25rem 0' }}></div>

              {/* Override Section */}
              {!generatedPass ? (
                <>
                  {searchResult.status === 'voted' ? (
                    <div style={{ padding: '14px', background: 'rgba(239,68,68,0.04)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.1)', textAlign: 'center' }}>
                      <XCircle size={28} color="#ef4444" style={{ opacity: 0.6, margin: '0 auto 8px auto', display: 'block' }} />
                      <p style={{ margin: 0, fontWeight: 700, color: '#ef4444', fontSize: '0.9rem' }}>Override Denied</p>
                      <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.82rem' }}>This student has already completed their voting session. Overrides cannot be issued.</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Issue Override</p>
                      
                      {/* Terminal Selector */}
                      <div style={{ marginBottom: '10px', position: 'relative' }}>
                        <MonitorPlay size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <select 
                          value={selectedBooth} 
                          onChange={(e) => { setSelectedBooth(e.target.value); setBoothError(false); }}
                          style={{ 
                            width: '100%', padding: '11px 11px 11px 36px', borderRadius: '10px', 
                            background: '#fff', color: '#0f172a', 
                            border: boothError ? '2px solid #ef4444' : '1px solid var(--border-color)', 
                            outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit', fontWeight: 500,
                            appearance: 'none', cursor: 'pointer', transition: 'border-color 0.2s'
                          }}
                        >
                          <option value="">Select Terminal...</option>
                          {booths && booths.filter(b => b.status !== 'offline').map(b => (
                            <option key={b.id} value={b.id}>{b.name} — {b.location}</option>
                          ))}
                        </select>
                        {boothError && (
                          <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={12} /> Please select a terminal first
                          </p>
                        )}
                      </div>

                      <button 
                        onClick={handleIssueOverride} 
                        style={{ 
                          width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#fff', border: 'none', borderRadius: '10px',
                          fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit',
                          boxShadow: '0 4px 12px rgba(245,158,11,0.25)', transition: 'all 0.2s ease'
                        }}
                      >
                        <FileKey size={18} /> Authorize Terminal Override
                      </button>

                      {/* Caution Notice */}
                      <div style={{ marginTop: '12px', padding: '10px 12px', background: 'rgba(245,158,11,0.04)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.1)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <AlertTriangle size={14} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                          This action is logged and audited. Override passes bypass normal credential verification.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Success State */
                <div style={{ padding: '1.5rem', background: 'rgba(16,185,129,0.04)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.12)', textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                    <CheckCircle2 size={26} color="#10b981" />
                  </div>
                  <h3 style={{ color: '#10b981', margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 700 }}>Override Authorized</h3>
                  <div style={{ padding: '10px', background: '#0f172a', borderRadius: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '2px', color: '#10b981', fontFamily: 'monospace' }}>ACCESS GRANTED</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    <strong>{searchResult.name}</strong> may now proceed to the assigned terminal.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="mod-panel" style={{ border: '1px dashed var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <FileKey size={26} color="#cbd5e1" />
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 700, color: '#94a3b8' }}>No Voter Selected</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '280px' }}>
              Search for a voter using their Name or ID to view their details and issue an override pass.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
