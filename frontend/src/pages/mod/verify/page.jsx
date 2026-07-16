import React, { useState } from 'react';
import { useKioskContext } from '@/context/KioskContext';
import { useElection } from '@/context/ElectionContext';
import { UserCheck, Search, CheckCircle2, XCircle, GraduationCap, MonitorPlay, Users, ChevronRight, AlertCircle } from 'lucide-react';
import '../mod.css';

export default function ModVerifyPage() {
  const { roster, enableVoting, booths } = useKioskContext();
  const { advancedSettings } = useElection();
  const [searchTerm, setSearchTerm] = useState('');
  const [foundStudent, setFoundStudent] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState('');
  const [boothError, setBoothError] = useState(false);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    setIsSearching(true);
    setIsAuthorized(false);
    setBoothError(false);
    setTimeout(() => {
      const student = roster.find(s => 
        s.id.toLowerCase() === searchTerm.toLowerCase() ||
        (s.name && s.name.toLowerCase() === searchTerm.toLowerCase())
      );
      setFoundStudent(student || 'not_found');
      setIsSearching(false);
    }, 350);
  };

  const handleAuthorize = () => {
    if (!selectedBooth) {
      setBoothError(true);
      return;
    }
    const isGradeEligible = advancedSettings.eligibleGrades ? advancedSettings.eligibleGrades.includes(foundStudent?.grade) : true;
    if (foundStudent && foundStudent.status !== 'voted' && isGradeEligible && selectedBooth) {
      enableVoting(foundStudent.id, selectedBooth);
      setIsAuthorized(true);
      setBoothError(false);
    }
  };

  const selectStudent = (student) => {
    setSearchTerm(student.id);
    setIsAuthorized(false);
    setBoothError(false);
    setIsSearching(true);
    setTimeout(() => {
      setFoundStudent(student);
      setIsSearching(false);
    }, 250);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const votedCount = roster.filter(s => s.status === 'voted').length;
  const eligibleCount = roster.filter(s => s.status === 'eligible').length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ padding: '10px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', borderRadius: '14px', display: 'flex', boxShadow: '0 4px 12px rgba(139,92,246,0.25)' }}>
              <UserCheck size={24} color="#fff" />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Identity Verification
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
            Search and verify student credentials before authorizing booth access.
          </p>
        </div>
        {/* Quick stats */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ padding: '10px 16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Eligible</p>
            <p style={{ margin: '2px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{eligibleCount}</p>
          </div>
          <div style={{ padding: '10px 16px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Voted</p>
            <p style={{ margin: '2px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6' }}>{votedCount}</p>
          </div>
        </div>
      </div>

      {/* ─── Search Bar ─── */}
      <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Enter Voter ID (e.g. PASS-1001) or Name..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setFoundStudent(null); setIsAuthorized(false); }}
              style={{ 
                width: '100%', padding: '14px 14px 14px 44px', 
                background: '#fff', border: '2px solid var(--border-color)', borderRadius: '12px',
                outline: 'none', color: '#0f172a', fontSize: '0.95rem', fontFamily: 'inherit',
                fontWeight: 500, transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#8b5cf6'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
            />
          </div>
          <button 
            type="submit" 
            disabled={isSearching}
            style={{ 
              padding: '14px 28px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
              color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem',
              cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(139,92,246,0.25)', transition: 'all 0.2s ease',
              opacity: isSearching ? 0.7 : 1
            }}
          >
            <Search size={18} /> {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* ─── Student Result Card ─── */}
      {foundStudent && foundStudent !== 'not_found' && (
        <div className="mod-panel" style={{ marginBottom: '1.5rem' }}>
          
          {/* Card Top Bar */}
          <div style={{ height: '4px', background: foundStudent.status === 'voted' ? '#ef4444' : '#10b981' }}></div>
          
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              
              {/* Avatar */}
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '16px', 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(139,92,246,0.25)', flexShrink: 0
              }}>
                <span style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 800 }}>{foundStudent.name.charAt(0)}</span>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{foundStudent.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                      <GraduationCap size={15} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{foundStudent.grade}</span>
                      <span style={{ opacity: 0.4 }}>•</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, fontFamily: 'monospace', color: '#8b5cf6' }}>{foundStudent.id}</span>
                    </div>
                  </div>
                  {/* Status Badge */}
                  {foundStudent.status === 'voted' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      <CheckCircle2 size={13} /> Voted
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.15)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></span> Eligible
                    </span>
                  )}
                </div>

                {/* Status Row */}
                {(() => {
                  const isGradeEligible = advancedSettings.eligibleGrades ? advancedSettings.eligibleGrades.includes(foundStudent.grade) : true;
                  return (
                    <React.Fragment>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                        <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                          <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Voting Status</p>
                          <p style={{ margin: '4px 0 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                            {foundStudent.status === 'voted' ? 'Already Voted' : (!isGradeEligible ? 'Grade Ineligible' : 'Eligible to Vote')}
                          </p>
                        </div>
                        <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                          <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Clearance</p>
                          <p style={{ margin: '4px 0 0', fontSize: '0.95rem', fontWeight: 700, color: (foundStudent.status === 'voted' || !isGradeEligible) ? '#ef4444' : '#10b981' }}>
                            {(foundStudent.status === 'voted' || !isGradeEligible) ? 'DENIED' : 'APPROVED'}
                          </p>
                        </div>
                      </div>

                      {/* Authorization Section */}
                      {isAuthorized ? (
                        <div style={{ padding: '14px', background: 'rgba(16,185,129,0.06)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.15)', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px', color: '#10b981' }}>
                            <CheckCircle2 size={18} />
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Terminal Access Granted</span>
                          </div>
                          <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
                            <strong>{foundStudent.name}</strong> may now proceed to the terminal.
                          </p>
                        </div>
                      ) : foundStudent.status === 'voted' ? (
                        <div style={{ padding: '12px', background: 'rgba(239,68,68,0.05)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.12)', textAlign: 'center' }}>
                          <p style={{ margin: 0, color: '#ef4444', fontSize: '0.88rem', fontWeight: 600 }}>This voter has already completed their voting session.</p>
                        </div>
                      ) : !isGradeEligible ? (
                        <div style={{ padding: '12px', background: 'rgba(245,158,11,0.05)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
                          <p style={{ margin: 0, color: '#d97706', fontSize: '0.88rem', fontWeight: 600 }}>This voter's grade level is not currently permitted to vote.</p>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                              <MonitorPlay size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                              <select 
                                value={selectedBooth} 
                                onChange={(e) => { setSelectedBooth(e.target.value); setBoothError(false); }}
                                style={{ 
                                  width: '100%', padding: '12px 12px 12px 36px', borderRadius: '10px', 
                                  background: '#fff', color: '#0f172a', 
                                  border: boothError ? '2px solid #ef4444' : '1px solid var(--border-color)', 
                                  outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit', fontWeight: 500,
                                  appearance: 'none', cursor: 'pointer', transition: 'border-color 0.2s ease'
                                }}
                              >
                                <option value="">Select Terminal...</option>
                                {booths.filter(b => b.status !== 'offline').map(b => (
                                  <option key={b.id} value={b.id}>{b.name} — {b.location}</option>
                                ))}
                              </select>
                              {boothError && (
                                <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <AlertCircle size={13} /> Please select a terminal first
                                </p>
                              )}
                            </div>
                            <button
                              onClick={handleAuthorize}
                              style={{
                                padding: '12px 24px', fontSize: '0.9rem', fontWeight: 700,
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: '#fff', border: 'none', borderRadius: '10px',
                                boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
                                cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px',
                                transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                              }}
                            >
                              <CheckCircle2 size={18} /> Authorize
                            </button>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Not Found */}
      {foundStudent === 'not_found' && (
        <div className="mod-panel" style={{ padding: '2.5rem', textAlign: 'center', border: '1px dashed rgba(239,68,68,0.25)', marginBottom: '1.5rem' }}>
          <XCircle size={40} color="#ef4444" style={{ margin: '0 auto 12px auto', opacity: 0.7 }} />
          <h3 style={{ color: '#ef4444', margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 700 }}>No Record Found</h3>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>No student matches "<strong>{searchTerm}</strong>". Check for typos and try again.</p>
        </div>
      )}

      {/* ─── Voter Directory ─── */}
      <div className="mod-panel">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#06b6d4" /> Voter Directory
          </h3>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Filter by name or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px 8px 8px 34px', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', outline: 'none', color: '#0f172a', fontSize: '0.85rem', fontFamily: 'inherit' }}
            />
          </div>
        </div>
        
        <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-color)' }}>Voter ID</th>
                <th style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-color)' }}>Name</th>
                <th style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-color)' }}>Grade</th>
                <th style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-color)' }}>Status</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-color)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {roster.filter(s => 
                !searchTerm || 
                s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map(student => (
                <tr 
                  key={student.id} 
                  style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s ease', cursor: 'pointer' }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#8b5cf6', fontSize: '0.88rem', fontWeight: 600 }}>{student.id}</td>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{student.name}</td>
                  <td style={{ padding: '10px 16px', color: '#64748b', fontSize: '0.88rem' }}>{student.grade}</td>
                  <td style={{ padding: '10px 16px' }}>
                    {student.status === 'voted' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', background: 'rgba(239,68,68,0.07)', color: '#ef4444', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <CheckCircle2 size={12} /> Voted
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', background: 'rgba(16,185,129,0.07)', color: '#10b981', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }}></span> Eligible
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => selectStudent(student)}
                      style={{ 
                        background: '#f8fafc', border: '1px solid var(--border-color)', color: '#0f172a', 
                        padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem',
                        fontWeight: 600, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '5px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#8b5cf6'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#8b5cf6'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                      Verify <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {roster.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No voters found in directory.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
