import React from 'react';
import { Card } from '@/components/common/Card';
import { ShieldCheck, AlertTriangle, Key, Activity, Users, LayoutDashboard, Flag } from 'lucide-react';
import { useKioskContext } from '@/context/KioskContext';

export default function ModDashboard() {
  const { kioskStatus, activeStudent, isLockdown, toggleLockdown } = useKioskContext();

  // Mock Flagged Data
  const flaggedActivity = [];

  const dashboardStats = [
    { title: "Verified Today", value: "1,248", color: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", icon: <Users size={28} color="#fff" /> },
    { title: "Active Kiosks", value: "42", color: "linear-gradient(135deg, #10b981 0%, #059669 100%)", icon: <Activity size={28} color="#fff" /> },
    { title: "Open Alerts", value: "3", color: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", icon: <AlertTriangle size={28} color="#fff" /> },
    { title: "Support Flags", value: "5", color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", icon: <Flag size={28} color="#fff" /> },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem', position: 'relative' }}>
      
      {/* Background glow for premium feel */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '40%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Premium Header */}
        <div className="page-header" style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem' }}>
          <div>
            <div className="header-title-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <div style={{ padding: '12px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', display: 'flex', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <ShieldCheck size={28} color="#3b82f6" style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.5))' }} />
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                Authorization Desk
              </h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p className="header-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Key size={18} style={{ color: 'var(--accent)' }} /> Manage secure terminal access and monitor voter activity.
              </p>
              
              {/* Emergency Lockdown Toggle */}
              <button
                onClick={toggleLockdown}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px',
                  fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer',
                  border: isLockdown ? 'none' : '1px solid rgba(239,68,68,0.3)',
                  background: isLockdown ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'rgba(239,68,68,0.05)',
                  color: isLockdown ? '#fff' : 'var(--danger)',
                  boxShadow: isLockdown ? '0 8px 25px rgba(239,68,68,0.4)' : 'none',
                  animation: isLockdown ? 'pulse 2s infinite' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <AlertTriangle size={20} />
                {isLockdown ? 'LIFT LOCKDOWN' : 'EMERGENCY FREEZE'}
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {dashboardStats.map((stat, i) => (
            <div 
              key={i} 
              className="glass-panel stat-card" 
              style={{ 
                padding: '1.75rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.25rem', 
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '20px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                animation: `fadeUp 0.5s ease-out ${i * 0.1}s backwards` 
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.1)`; e.currentTarget.style.borderColor = `rgba(255,255,255,0.15)`; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <div style={{ background: stat.color, padding: '16px', borderRadius: '16px', display: 'flex', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.title}</p>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: 1 }}>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Flagged Activity Log */}
        {flaggedActivity.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <Activity size={20} color="var(--accent)" />
              <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--text-primary)', fontWeight: '700', letterSpacing: '-0.01em' }}>Recent Security Flags</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {flaggedActivity.map((log, i) => (
                <div key={log.id} className="glass-panel" style={{ 
                  padding: '1.5rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `slideDown 0.4s ease-out ${i * 0.1}s backwards`
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = log.severity === 'critical' ? '0 12px 30px rgba(239,68,68,0.15)' : '0 12px 30px rgba(245,158,11,0.15)'; e.currentTarget.style.borderColor = log.severity === 'critical' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'; e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))'; }}
                >
                  {/* Severity Indicator Line */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', background: log.severity === 'critical' ? 'var(--danger)' : 'var(--warning)', boxShadow: `0 0 15px ${log.severity === 'critical' ? 'var(--danger)' : 'var(--warning)'}` }}></div>
                  
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', paddingLeft: '8px' }}>
                    <div style={{ padding: '12px', background: log.severity === 'critical' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', borderRadius: '14px', border: `1px solid ${log.severity === 'critical' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`, display: 'flex' }}>
                      <AlertTriangle color={log.severity === 'critical' ? 'var(--danger)' : 'var(--warning)'} size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: '700', letterSpacing: '-0.01em' }}>{log.studentId}</h4>
                      <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{log.issue}</p>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>{log.time}</span>
                    <button className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.9rem', fontWeight: '600', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>Review Case</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
