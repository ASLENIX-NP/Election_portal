import React from 'react';
import { History, ShieldCheck, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useKioskContext } from '@/context/KioskContext';
import '../mod.css';

export default function ModAuditLogs() {
  const { auditLogs } = useKioskContext();

  const getLogIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle size={20} color="var(--danger)" />;
      case 'security': return <ShieldCheck size={20} color="var(--accent)" />;
      case 'success': return <CheckCircle size={20} color="var(--success)" />;
      case 'warning': return <AlertTriangle size={20} color="var(--warning)" />;
      default: return <Info size={20} color="var(--text-secondary)" />;
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'critical': return 'rgba(239, 68, 68, 0.1)';
      case 'security': return 'rgba(59, 130, 246, 0.1)';
      case 'success': return 'rgba(16, 185, 129, 0.1)';
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem', position: 'relative' }}>
      <div className="page-header" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <div className="header-title-row" style={{ marginBottom: '12px' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '2.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
            <div style={{ padding: '12px', background: 'var(--surface-hover)', borderRadius: '16px', display: 'flex' }}>
              <History size={28} color="var(--accent)" />
            </div>
            Audit Logs
          </h1>
        </div>
        <p className="header-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: 0 }}>
          Comprehensive immutable timeline of all terminal and authorization events.
        </p>
      </div>

      <div className="mod-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {auditLogs.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 0' }}>No logs recorded yet.</div>
        ) : (
          auditLogs.map((log) => (
            <div key={log.id} style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem', 
              padding: '1rem', borderRadius: '12px',
              background: 'var(--surface-color)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: getLogColor(log.type) }}>
                {getLogIcon(log.type)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{log.desc}</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Action by: <strong>{log.by}</strong>
                </p>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
