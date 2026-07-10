import React, { useState } from 'react';
import { useKioskContext } from '@/context/KioskContext';
import { UserCheck, Search, CheckCircle2, XCircle, ChevronRight, GraduationCap, Key } from 'lucide-react';

export default function ModVerifyPage() {
  const { roster, enableVoting, booths } = useKioskContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [foundStudent, setFoundStudent] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    setIsSearching(true);
    setIsAuthorized(false); // Clear previous authorization on new search
    // Simulate a brief network delay for premium feel
    setTimeout(() => {
      const student = roster.find(s => s.id.toLowerCase() === searchTerm.toLowerCase());
      setFoundStudent(student || 'not_found');
      setIsSearching(false);
    }, 400);
  };

  const handleAuthorize = () => {
    if (foundStudent && foundStudent.status !== 'voted' && selectedBooth) {
      enableVoting(foundStudent.id, selectedBooth);
      setIsAuthorized(true);
    } else if (!selectedBooth) {
      alert("Please select a terminal.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem', maxWidth: '850px', margin: '0 auto', position: 'relative' }}>
      
      {/* Ambient background */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="page-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '12px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <UserCheck size={32} color="#8b5cf6" />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>Identity Verification</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>Search and verify student credentials before authorizing physical voting booth access.</p>
        </div>

          {foundStudent && (
            <div style={{ animation: 'slideDown 0.5s ease-out', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }}></div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Voter</span>
                <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }}></div>
              </div>

              {foundStudent === 'not_found' ? (
                <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(239,68,68,0.05)', borderRadius: '16px', border: '1px dashed rgba(239,68,68,0.3)' }}>
                  <XCircle size={48} color="var(--danger)" style={{ margin: '0 auto 16px auto', opacity: 0.8 }} />
                  <h3 style={{ color: 'var(--danger)', margin: '0 0 8px 0', fontSize: '1.35rem' }}>Credential Not Found</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No record matches the provided Voting Pass. Please check for typos.</p>
                </div>
              ) : (
                /* Premium Digital ID Card */
                <div style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                  borderRadius: '20px', 
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,1)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Card Header Pattern */}
                  <div style={{ height: '80px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-10%', top: '-50%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', right: '5%', top: '-20%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
                  </div>

                  <div style={{ padding: '0 2rem 2rem 2rem', position: 'relative' }}>
                    {/* Floating Avatar Placeholder */}
                    <div style={{ 
                      width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'absolute', top: '-40px', left: '2rem',
                      boxShadow: '0 10px 25px rgba(139,92,246,0.3)', border: '4px solid #fff'
                    }}>
                      <span style={{ fontSize: '2rem', color: '#fff', fontWeight: '800' }}>{foundStudent.name.charAt(0)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: '56px', marginBottom: '2rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{foundStudent.name}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                          <GraduationCap size={16} />
                          <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{foundStudent.grade}</span>
                          <span style={{ opacity: 0.5 }}>•</span>
                          <span style={{ fontSize: '0.95rem', fontWeight: '500', fontFamily: 'monospace' }}>{foundStudent.id}</span>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.2)' }}>
                          <div className="pulse-dot"></div>
                          <span style={{ color: 'var(--success)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Verified</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Voting Status</p>
                          {foundStudent.status === 'voted' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <CheckCircle2 color="var(--success)" size={20} />
                              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Already Voted</span>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--accent)' }}></div>
                              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Eligible to Vote</span>
                            </div>
                          )}
                        </div>
                        
                        <div style={{ textAlign: 'right' }}>
                           <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Clearance</p>
                           <span style={{ fontSize: '1.1rem', fontWeight: '700', color: foundStudent.status === 'voted' ? 'var(--danger)' : 'var(--success)' }}>
                             {foundStudent.status === 'voted' ? 'DENIED' : 'APPROVED'}
                           </span>
                        </div>
                      </div>
                    </div>

                    {isAuthorized ? (
                      <div style={{ padding: '16px', background: 'rgba(16,185,129,0.1)', borderRadius: '14px', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px', color: 'var(--success)' }}>
                          <CheckCircle2 size={18} />
                          <span style={{ fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Terminal Access Granted</span>
                        </div>
                        <h2 style={{ margin: '12px 0', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{foundStudent.name} is authorized.</h2>
                        <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>The voter may now proceed to the terminal and begin voting.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <select 
                          value={selectedBooth} 
                          onChange={(e) => setSelectedBooth(e.target.value)}
                          style={{ padding: '16px', borderRadius: '14px', background: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem', flex: 1 }}
                        >
                          <option value="">Select Terminal...</option>
                          {booths.map(b => (
                            <option key={b.id} value={b.id}>{b.name} ({b.location})</option>
                          ))}
                        </select>
                        <button
                          className="btn"
                          disabled={foundStudent.status === 'voted' || !selectedBooth}
                          onClick={handleAuthorize}
                          style={{
                            flex: 2, justifyContent: "center", padding: '16px', fontSize: '1.1rem', fontWeight: '700',
                            background: foundStudent.status === 'voted' || !selectedBooth ? 'rgba(0,0,0,0.05)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: foundStudent.status === 'voted' || !selectedBooth ? 'var(--text-secondary)' : '#fff',
                            border: 'none', borderRadius: '14px',
                            boxShadow: foundStudent.status === 'voted' || !selectedBooth ? 'none' : '0 8px 20px rgba(16,185,129,0.3)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {foundStudent.status === 'voted' ? 'Voting Session Completed' : 'Authorize Terminal Access'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Voter Directory Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={24} color="var(--accent-cyan)" />
              Voter Directory
            </h2>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '10px', outline: 'none', color: 'var(--text-primary)', fontSize: '0.95rem' }}
              />
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            <div className="data-table-wrapper" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Voter ID</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Grade</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: '600' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.filter(s => 
                    !searchTerm || 
                    s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  ).map(student => (
                    <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{student.id}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '500', color: 'var(--text-primary)' }}>{student.name}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{student.grade}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {student.status === 'voted' ? (
                          <span style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>Voted</span>
                        ) : (
                          <span style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>Eligible</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button 
                          onClick={() => {
                            setSearchTerm(student.id);
                            // Simulate quick search
                            setIsSearching(true);
                            setTimeout(() => {
                              setFoundStudent(student);
                              setIsSearching(false);
                            }, 300);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                  {roster.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No voters found in directory.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
