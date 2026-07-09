import React, { useState } from 'react';
import { useKioskContext } from '@/context/KioskContext';
import { MonitorPlay, ShieldAlert, Power, Zap, ChevronRight, Laptop, LayoutGrid, Map as MapIcon } from 'lucide-react';

export default function ModBoothsPage() {
  const { booths, updateBoothStatus, activeStudent, enableVoting, cancelVoting, isLockdown } = useKioskContext();
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [passInput, setPassInput] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem', position: 'relative' }}>
      
      {/* Ambient background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '500px', height: '500px', background: isLockdown ? 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, rgba(0,0,0,0) 70%)' : 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none', transition: 'background 0.5s ease' }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="page-header" style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="header-title-row" style={{ marginBottom: '12px' }}>
              <h1 style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.03em', margin: 0, background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                <div style={{ padding: '12px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', display: 'flex', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Laptop size={28} color={isLockdown ? "#ef4444" : "#10b981"} />
                </div>
                Live Kiosk Network
              </h1>
            </div>
            <p className="header-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
              Manage physical voting terminals, monitor connection status, and securely start voter sessions.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.1)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: viewMode === 'grid' ? '#3b82f6' : 'transparent', color: viewMode === 'grid' ? '#fff' : 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <LayoutGrid size={18} /> Grid List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: viewMode === 'map' ? '#3b82f6' : 'transparent', color: viewMode === 'map' ? '#fff' : 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <MapIcon size={18} /> Floor Plan
            </button>
          </div>
        </div>

        {isLockdown && (
          <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(185,28,28,0.1) 100%)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '16px', animation: 'pulse 2s infinite' }}>
            <ShieldAlert size={32} color="var(--danger)" />
            <div>
              <h2 style={{ margin: 0, color: 'var(--danger)', fontSize: '1.25rem', fontWeight: '800' }}>EMERGENCY LOCKDOWN ACTIVE</h2>
              <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.8)' }}>All terminals are frozen. Voting assignments cannot be made until lockdown is lifted from the Authorization Desk.</p>
            </div>
          </div>
        )}

        {viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
            {booths.map((booth, i) => {
              const isIdle = booth.status === 'idle';
              const isOffline = booth.status === 'offline';
              const isActiveSession = activeStudent && booth.status !== 'offline' && selectedBooth !== booth.id;

              return (
                <div key={booth.id} className="glass-panel" style={{ 
                  padding: '0', 
                  overflow: 'hidden',
                  animation: `fadeUp 0.5s ease-out ${i * 0.15}s backwards`,
                  boxShadow: isActiveSession ? '0 15px 35px rgba(245,158,11,0.2)' : isLockdown ? '0 10px 30px rgba(239,68,68,0.1)' : '0 10px 30px rgba(0,0,0,0.05)',
                  border: isActiveSession ? '1px solid rgba(245,158,11,0.4)' : isLockdown ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--border-color)',
                  transition: 'all 0.3s ease',
                  opacity: isLockdown ? 0.7 : 1
                }}>
                  {/* Card Header Strip */}
                  <div style={{ height: '6px', background: isLockdown ? 'var(--danger)' : isIdle ? 'linear-gradient(90deg, #10b981, #34d399)' : isOffline ? 'var(--text-secondary)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}></div>
                  
                  <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <div style={{ padding: '12px', background: isLockdown ? 'rgba(239,68,68,0.1)' : isOffline ? 'rgba(0,0,0,0.05)' : isActiveSession ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', borderRadius: '14px', color: isLockdown ? 'var(--danger)' : isOffline ? 'var(--text-secondary)' : isActiveSession ? 'var(--warning)' : 'var(--success)' }}>
                          <MonitorPlay size={26} />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-primary)', fontWeight: '700', letterSpacing: '-0.01em' }}>{booth.name}</h3>
                          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px', fontWeight: '500' }}>{booth.location}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isLockdown ? 'rgba(239,68,68,0.1)' : isOffline ? 'rgba(0,0,0,0.05)' : 'rgba(16,185,129,0.1)', padding: '6px 12px', borderRadius: '20px', border: `1px solid ${isLockdown ? 'rgba(239,68,68,0.2)' : isOffline ? 'transparent' : 'rgba(16,185,129,0.2)'}` }}>
                        {!isOffline && !isLockdown && <div className="pulse-dot" style={{ background: isActiveSession ? 'var(--warning)' : 'var(--success)' }}></div>}
                        <span style={{ color: isLockdown ? 'var(--danger)' : isOffline ? 'var(--text-secondary)' : isActiveSession ? 'var(--warning)' : 'var(--success)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {isLockdown ? 'LOCKED' : isActiveSession ? 'VOTING...' : booth.status}
                        </span>
                      </div>
                    </div>

                    <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-color)', borderStyle: 'dashed' }} />

                    {/* Active Session Premium View */}
                    {isActiveSession && !isLockdown ? (
                      <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(217,119,6,0.05) 100%)', borderRadius: '16px', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Secure Session Active</span>
                          <ShieldAlert size={16} color="#d97706" />
                        </div>
                        <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '700', fontFamily: 'monospace', letterSpacing: '1px', marginBottom: '16px' }}>
                          PASS: {activeStudent}
                        </div>
                        <button 
                          className="btn" 
                          style={{ width: '100%', justifyContent: 'center', padding: '12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', boxShadow: '0 4px 15px rgba(220,38,38,0.3)' }}
                          onClick={cancelVoting}
                        >
                          Force Terminate Session
                        </button>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: selectedBooth === booth.id ? '1rem' : 0 }}>
                          <button 
                            className="btn" 
                            style={{ 
                              flex: 1, justifyContent: 'center', padding: '12px', fontWeight: '600', borderRadius: '12px',
                              background: isOffline ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(239,68,68,0.1)',
                              color: isOffline ? '#fff' : 'var(--danger)', border: 'none',
                              boxShadow: isOffline && !isLockdown ? '0 6px 15px rgba(16,185,129,0.2)' : 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => updateBoothStatus(booth.id, isOffline ? 'idle' : 'offline')}
                            disabled={isLockdown}
                          >
                            <Power size={18} /> {isOffline ? 'Boot Terminal' : 'Shutdown'}
                          </button>
                          
                          <button 
                            className="btn" 
                            style={{ 
                              flex: 1, justifyContent: 'center', padding: '12px', fontWeight: '600', borderRadius: '12px',
                              background: isOffline || isLockdown ? 'rgba(0,0,0,0.05)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                              color: isOffline || isLockdown ? 'var(--text-secondary)' : '#fff', border: 'none',
                              boxShadow: isOffline || isLockdown ? 'none' : '0 6px 15px rgba(59,130,246,0.3)',
                              opacity: isOffline || isLockdown ? 0.6 : 1, transition: 'all 0.3s ease'
                            }}
                            onClick={() => setSelectedBooth(selectedBooth === booth.id ? null : booth.id)}
                            disabled={isOffline || isLockdown}
                          >
                            <Zap size={18} /> Authorize Voter
                          </button>
                        </div>

                        {/* Authorize Input Panel */}
                        {selectedBooth === booth.id && !isOffline && !isLockdown && (
                          <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.03)', borderRadius: '14px', border: '1px solid var(--border-color)', animation: 'slideDown 0.3s ease' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Authorize pass for {booth.name}</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input 
                                type="text" 
                                placeholder="e.g. PASS-1001" 
                                value={passInput}
                                onChange={e => setPassInput(e.target.value)}
                                style={{ 
                                  flex: 1, padding: '12px 16px', fontSize: '1rem', 
                                  background: 'var(--surface-color)', border: '2px solid var(--border-color)', borderRadius: '10px',
                                  outline: 'none', textTransform: 'uppercase', letterSpacing: '1px'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
                              />
                              <button 
                                className="btn btn-primary"
                                style={{ padding: '0 1rem', background: '#3b82f6', border: 'none', borderRadius: '10px', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }}
                                onClick={() => {
                                  if (passInput) {
                                    enableVoting(passInput);
                                    setPassInput('');
                                    setSelectedBooth(null);
                                  }
                                }}
                              >
                                <ChevronRight size={24} />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* INTERACTIVE FLOOR PLAN VIEW */
          <div className="glass-panel" style={{ padding: '3rem', minHeight: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '900px', height: '500px', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '2rem', justifyContent: 'center', alignContent: 'center' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#0f172a', padding: '0 10px', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Polling Room Layout</div>
              
              {booths.map((booth, i) => {
                const isOffline = booth.status === 'offline';
                const isActiveSession = activeStudent && booth.status !== 'offline' && selectedBooth !== booth.id;
                
                let glowColor = isOffline ? 'transparent' : isLockdown ? 'rgba(239,68,68,0.5)' : isActiveSession ? 'rgba(245,158,11,0.5)' : 'rgba(16,185,129,0.3)';
                let borderColor = isOffline ? 'rgba(255,255,255,0.1)' : isLockdown ? 'var(--danger)' : isActiveSession ? 'var(--warning)' : 'var(--success)';

                return (
                  <div key={booth.id} style={{
                    width: '180px', height: '140px', background: 'rgba(30, 41, 59, 0.6)',
                    borderRadius: '16px', border: `2px solid ${borderColor}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    boxShadow: `0 0 30px ${glowColor}`,
                    transition: 'all 0.4s ease',
                    opacity: isOffline ? 0.5 : 1,
                    position: 'relative'
                  }}>
                    <MonitorPlay size={32} color={isOffline ? '#64748b' : isLockdown ? 'var(--danger)' : isActiveSession ? 'var(--warning)' : 'var(--success)'} />
                    <span style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>{booth.name}</span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '20px', color: isOffline ? '#64748b' : isLockdown ? 'var(--danger)' : isActiveSession ? 'var(--warning)' : 'var(--success)', fontWeight: '600' }}>
                      {isLockdown ? 'LOCKED' : isOffline ? 'OFFLINE' : isActiveSession ? 'IN USE' : 'READY'}
                    </span>
                  </div>
                );
              })}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
