import React, { useState } from 'react';
import { useKioskContext } from '@/context/KioskContext';
import { MonitorPlay, ShieldAlert, Power, Zap, ChevronRight, Laptop, LayoutGrid, Map as MapIcon, AlertTriangle, Wifi, WifiOff, User, XCircle } from 'lucide-react';
import '../mod.css';

export default function ModBoothsPage() {
  const { booths, updateBoothStatus, activeStudent, enableVoting, cancelVoting, isLockdown, roster } = useKioskContext();
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [passInput, setPassInput] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const onlineCount = booths.filter(b => b.status !== 'offline').length;
  const offlineCount = booths.filter(b => b.status === 'offline').length;

  // Check if a booth has an active session via context
  const getBoothSession = (boothId) => {
    const booth = booths.find(b => b.id === boothId);
    return booth ? booth.activeStudentSession : null;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ padding: '10px', background: isLockdown ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '14px', display: 'flex', boxShadow: isLockdown ? '0 4px 12px rgba(239,68,68,0.25)' : '0 4px 12px rgba(16,185,129,0.25)' }}>
              <Laptop size={24} color="#fff" />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Live Kiosk Network
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
            Manage voting terminals, monitor status, and authorize voter sessions.
          </p>
        </div>

        {/* View Toggle + Status Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wifi size={14} color="#10b981" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>{onlineCount} Online</span>
            </div>
            <div style={{ padding: '6px 14px', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <WifiOff size={14} color="#94a3b8" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8' }}>{offlineCount} Offline</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '7px', border: 'none', background: viewMode === 'grid' ? '#fff' : 'transparent', color: viewMode === 'grid' ? '#0f172a' : '#94a3b8', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}
            >
              <LayoutGrid size={15} /> Grid
            </button>
            <button 
              onClick={() => setViewMode('map')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '7px', border: 'none', background: viewMode === 'map' ? '#fff' : 'transparent', color: viewMode === 'map' ? '#0f172a' : '#94a3b8', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', boxShadow: viewMode === 'map' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}
            >
              <MapIcon size={15} /> Floor Plan
            </button>
          </div>
        </div>
      </div>

      {/* Lockdown Banner */}
      {isLockdown && (
        <div style={{ padding: '1rem 1.25rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', borderRadius: '10px', display: 'flex' }}>
            <ShieldAlert size={20} color="#ef4444" />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#ef4444', fontSize: '0.9rem' }}>EMERGENCY LOCKDOWN ACTIVE</p>
            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>All terminals are frozen. Voting cannot proceed until lockdown is lifted.</p>
          </div>
        </div>
      )}

      {/* ─── Grid View ─── */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {booths.map((booth) => {
            const isOffline = booth.status === 'offline';
            const boothSession = getBoothSession(booth.id);
            const hasSession = !!boothSession;

            const statusColor = isLockdown ? '#ef4444' : isOffline ? '#94a3b8' : hasSession ? '#f59e0b' : '#10b981';
            const statusLabel = isLockdown ? 'LOCKED' : isOffline ? 'OFFLINE' : hasSession ? 'IN SESSION' : 'READY';
            const statusBg = isLockdown ? 'rgba(239,68,68,0.06)' : isOffline ? '#f8fafc' : hasSession ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.06)';

            return (
              <div key={booth.id} className="mod-booth-card" style={{ opacity: isLockdown ? 0.7 : isOffline ? 0.6 : 1 }}>
                {/* Status Bar */}
                <div style={{ height: '3px', background: statusColor }}></div>
                
                <div style={{ padding: '1.25rem' }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${statusColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MonitorPlay size={22} color={statusColor} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 700 }}>{booth.name}</h3>
                        <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: '0.82rem', fontWeight: 500 }}>{booth.location}</p>
                      </div>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', background: statusBg, border: `1px solid ${statusColor}20` }}>
                      {!isOffline && !isLockdown && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, animation: 'pulse 2s infinite' }}></span>}
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{statusLabel}</span>
                    </div>
                  </div>

                  {/* Active Session Info */}
                  {hasSession && !isLockdown && !isOffline && (
                    <div style={{ padding: '10px 12px', background: 'rgba(245,158,11,0.05)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.12)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={14} color="#f59e0b" />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Active Voter</p>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, fontFamily: 'monospace' }}>{boothSession}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => cancelVoting(booth.id)}
                        style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s ease' }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
                      >
                        <XCircle size={13} /> End
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => updateBoothStatus(booth.id, isOffline ? 'idle' : 'offline')}
                      disabled={isLockdown}
                      style={{ 
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '10px', fontWeight: 600, borderRadius: '10px', fontSize: '0.85rem',
                        fontFamily: 'inherit', cursor: isLockdown ? 'not-allowed' : 'pointer',
                        background: isOffline ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)',
                        color: isOffline ? '#10b981' : '#ef4444', 
                        border: `1px solid ${isOffline ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)'}`,
                        transition: 'all 0.2s ease', opacity: isLockdown ? 0.5 : 1
                      }}
                    >
                      <Power size={16} /> {isOffline ? 'Boot' : 'Shutdown'}
                    </button>
                    
                    <button 
                      onClick={() => setSelectedBooth(selectedBooth === booth.id ? null : booth.id)}
                      disabled={isOffline || isLockdown}
                      style={{ 
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '10px', fontWeight: 600, borderRadius: '10px', fontSize: '0.85rem',
                        fontFamily: 'inherit', cursor: isOffline || isLockdown ? 'not-allowed' : 'pointer',
                        background: isOffline || isLockdown ? '#f8fafc' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: isOffline || isLockdown ? '#cbd5e1' : '#fff', border: 'none',
                        boxShadow: isOffline || isLockdown ? 'none' : '0 4px 10px rgba(59,130,246,0.2)',
                        transition: 'all 0.2s ease', opacity: isOffline || isLockdown ? 0.5 : 1
                      }}
                    >
                      <Zap size={16} /> Authorize
                    </button>
                  </div>

                  {/* Authorize Input Panel */}
                  {selectedBooth === booth.id && !isOffline && !isLockdown && (
                    <div style={{ marginTop: '10px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>Authorize voter for {booth.name}</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input 
                          type="text" 
                          placeholder="e.g. PASS-1001" 
                          value={passInput}
                          onChange={e => setPassInput(e.target.value)}
                          style={{ 
                            flex: 1, padding: '10px 14px', fontSize: '0.9rem', 
                            background: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px',
                            outline: 'none', textTransform: 'uppercase', letterSpacing: '1px',
                            fontFamily: 'monospace', color: '#0f172a', transition: 'border-color 0.2s ease'
                          }}
                          onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }}
                          onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
                        />
                        <button 
                          style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(59,130,246,0.25)' }}
                          onClick={() => {
                            if (passInput) {
                              enableVoting(passInput, booth.id);
                              setPassInput('');
                              setSelectedBooth(null);
                            }
                          }}
                        >
                          <ChevronRight size={20} color="#fff" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ─── Floor Plan View ─── */
        <div className="mod-panel">
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapIcon size={18} color="#3b82f6" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Polling Room Layout</h3>
          </div>
          <div style={{ padding: '3rem', minHeight: '450px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '800px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', alignContent: 'center' }}>
              {booths.map((booth) => {
                const isOffline = booth.status === 'offline';
                const boothSession = getBoothSession(booth.id);
                const hasSession = !!boothSession;
                
                const statusColor = isLockdown ? '#ef4444' : isOffline ? '#94a3b8' : hasSession ? '#f59e0b' : '#10b981';
                const statusLabel = isLockdown ? 'LOCKED' : isOffline ? 'OFFLINE' : hasSession ? 'IN USE' : 'READY';

                return (
                  <div key={booth.id} className="mod-map-booth" style={{
                    border: `2px solid ${statusColor}30`,
                    boxShadow: `0 4px 16px ${statusColor}10`,
                    opacity: isOffline && !isLockdown ? 0.5 : 1,
                  }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${statusColor}20`; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 16px ${statusColor}10`; }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${statusColor}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MonitorPlay size={26} color={statusColor} />
                    </div>
                    <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.95rem' }}>{booth.name}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>{booth.location}</span>
                    <span style={{ fontSize: '0.68rem', background: `${statusColor}10`, padding: '3px 10px', borderRadius: '20px', color: statusColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', border: `1px solid ${statusColor}20`, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {!isOffline && !isLockdown && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusColor, animation: 'pulse 2s infinite' }}></span>}
                      {statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
