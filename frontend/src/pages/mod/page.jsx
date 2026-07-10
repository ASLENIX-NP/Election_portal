import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, Activity, Users, Flag, UserCheck, MonitorPlay, RefreshCcw, ChevronRight, Clock, Zap, CheckCircle2, Lock } from 'lucide-react';
import { useKioskContext } from '@/context/KioskContext';

export default function ModDashboard() {
  const navigate = useNavigate();
  const { kioskStatus, activeStudent, isLockdown, toggleLockdown, booths, roster, auditLogs } = useKioskContext();

  const verifiedToday = roster.filter(s => s.status === 'voted').length;
  const eligibleCount = roster.filter(s => s.status === 'eligible').length;
  const onlineBooths = booths.filter(b => b.status !== 'offline').length;
  const recentLogs = auditLogs.slice(0, 5);

  const dashboardStats = [
    { title: 'Verified Today', value: verifiedToday.toString(), gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', lightBg: 'rgba(59,130,246,0.08)', icon: <UserCheck size={22} color="#fff" /> },
    { title: 'Eligible Voters', value: eligibleCount.toString(), gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', lightBg: 'rgba(16,185,129,0.08)', icon: <Users size={22} color="#fff" /> },
    { title: 'Active Kiosks', value: `${onlineBooths}/${booths.length}`, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', lightBg: 'rgba(139,92,246,0.08)', icon: <MonitorPlay size={22} color="#fff" /> },
    { title: 'Open Alerts', value: isLockdown ? '1' : '0', gradient: isLockdown ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', lightBg: isLockdown ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)', icon: <AlertTriangle size={22} color="#fff" /> },
  ];

  const quickActions = [
    { label: 'Verify Voters', desc: 'Search & authorize student identity', icon: <UserCheck size={20} />, color: '#3b82f6', path: '/mod/verify' },
    { label: 'Monitor Kiosks', desc: 'View live terminal status', icon: <MonitorPlay size={20} />, color: '#10b981', path: '/mod/booths' },
    { label: 'Reset Credential', desc: 'Issue override passes', icon: <RefreshCcw size={20} />, color: '#f59e0b', path: '/mod/reset' },
    { label: 'Audit Logs', desc: 'View full event timeline', icon: <Activity size={20} />, color: '#8b5cf6', path: '/mod/audit' },
  ];

  const getLogIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle size={15} color="#ef4444" />;
      case 'security': return <ShieldCheck size={15} color="#3b82f6" />;
      case 'success': return <CheckCircle2 size={15} color="#10b981" />;
      case 'warning': return <AlertTriangle size={15} color="#f59e0b" />;
      default: return <Activity size={15} color="#64748b" />;
    }
  };

  const getLogBg = (type) => {
    switch (type) {
      case 'critical': return 'rgba(239,68,68,0.08)';
      case 'security': return 'rgba(59,130,246,0.08)';
      case 'success': return 'rgba(16,185,129,0.08)';
      case 'warning': return 'rgba(245,158,11,0.08)';
      default: return '#f8fafc';
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ padding: '10px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '14px', display: 'flex', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
              <ShieldCheck size={24} color="#3b82f6" />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Authorization Desk
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={15} color="#3b82f6" /> Manage secure terminal access and monitor voter activity
          </p>
        </div>

        {/* Emergency Lockdown */}
        <button
          onClick={toggleLockdown}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px',
            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit',
            border: isLockdown ? 'none' : '1px solid rgba(239,68,68,0.25)',
            background: isLockdown ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'rgba(239,68,68,0.06)',
            color: isLockdown ? '#fff' : '#ef4444',
            boxShadow: isLockdown ? '0 6px 20px rgba(239,68,68,0.3)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          {isLockdown ? <Lock size={18} /> : <AlertTriangle size={18} />}
          {isLockdown ? 'LIFT LOCKDOWN' : 'EMERGENCY FREEZE'}
        </button>
      </div>

      {/* Lockdown Banner */}
      {isLockdown && (
        <div style={{ padding: '1rem 1.25rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', borderRadius: '10px', display: 'flex' }}>
            <AlertTriangle size={20} color="#ef4444" />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#ef4444', fontSize: '0.9rem' }}>EMERGENCY LOCKDOWN ACTIVE</p>
            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>All terminals are frozen. Voting cannot proceed until lockdown is lifted.</p>
          </div>
        </div>
      )}

      {/* ─── Stat Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {dashboardStats.map((stat, i) => (
          <div 
            key={i}
            style={{ 
              padding: '1.25rem',
              background: '#fff',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.title}</p>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: stat.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
            </div>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* ─── Main Grid ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        
        {/* Quick Actions */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#3b82f6" /> Quick Actions
            </h3>
          </div>
          <div style={{ padding: '0.75rem' }}>
            {quickActions.map((action, i) => (
              <button 
                key={i}
                onClick={() => navigate(action.path)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '14px', padding: '1rem 1.25rem', width: '100%',
                  background: 'transparent', border: '1px solid transparent', borderRadius: '12px', cursor: 'pointer',
                  transition: 'all 0.25s ease', textAlign: 'left', fontFamily: 'inherit'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.border = '1px solid var(--border-color)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.border = '1px solid transparent'; }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${action.color}12`, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {action.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{action.label}</p>
                  <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: '0.82rem' }}>{action.desc}</p>
                </div>
                <ChevronRight size={18} color="#cbd5e1" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="#8b5cf6" /> Recent Activity
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{auditLogs.length} events</span>
          </div>
          <div style={{ padding: '0.75rem 1rem', flex: 1, overflowY: 'auto', maxHeight: '340px' }}>
            {recentLogs.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 0', fontSize: '0.9rem' }}>No activity recorded yet.</div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} style={{ display: 'flex', gap: '10px', padding: '0.75rem', borderRadius: '10px', marginBottom: '0.25rem', transition: 'background 0.2s ease' }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: getLogBg(log.type), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    {getLogIcon(log.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{log.by}</span>
                      <span style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>•</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={10} /> {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => navigate('/mod/audit')}
              style={{ width: '100%', padding: '10px', background: '#f8fafc', border: '1px dashed var(--border-color)', borderRadius: '10px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
            >
              View Full Audit Log <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Kiosk Status Strip ─── */}
      <div style={{ marginTop: '1.25rem', background: '#fff', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MonitorPlay size={18} color="#10b981" /> Terminal Overview
          </h3>
          <button
            onClick={() => navigate('/mod/booths')}
            style={{ fontSize: '0.82rem', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Manage <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${booths.length}, 1fr)`, gap: '0' }}>
          {booths.map((booth, i) => {
            const isOffline = booth.status === 'offline';
            const statusColor = isLockdown ? '#ef4444' : isOffline ? '#94a3b8' : '#10b981';
            const statusLabel = isLockdown ? 'LOCKED' : isOffline ? 'OFFLINE' : booth.status.toUpperCase();
            
            return (
              <div key={booth.id} style={{ padding: '1.25rem 1.5rem', borderRight: i < booths.length - 1 ? '1px solid var(--border-color)' : 'none', opacity: isOffline && !isLockdown ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <MonitorPlay size={18} color={statusColor} />
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{booth.name}</span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: '#94a3b8' }}>{booth.location}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', background: `${statusColor}12`, border: `1px solid ${statusColor}25` }}>
                  {!isOffline && !isLockdown && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, animation: 'pulse 2s infinite' }}></span>}
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{statusLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
