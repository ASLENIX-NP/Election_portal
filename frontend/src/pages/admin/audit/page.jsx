import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, AlertTriangle, FileText, Vote, Clock, Hash } from 'lucide-react';
import { useElection } from '@/context/ElectionContext';
import '../dashboard.css';

export default function AuditLedger() {
  const { recentActivity } = useElection();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredLogs = recentActivity.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.hash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getIconForType = (type) => {
    switch(type) {
      case 'vote': return <Vote size={18} color="#3b82f6" />;
      case 'alert': return <AlertTriangle size={18} color="#ef4444" />;
      case 'system': return <ShieldCheck size={18} color="#10b981" />;
      default: return <FileText size={18} color="#64748b" />;
    }
  };

  const getColorForType = (type) => {
    switch(type) {
      case 'vote': return 'rgba(59, 130, 246, 0.1)';
      case 'alert': return 'rgba(239, 68, 68, 0.1)';
      case 'system': return 'rgba(16, 185, 129, 0.1)';
      default: return '#f8fafc';
    }
  };

  const getLabelForType = (type) => {
    switch(type) {
      case 'vote': return { text: 'Vote', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' };
      case 'alert': return { text: 'Alert', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' };
      case 'system': return { text: 'System', color: '#10b981', bg: 'rgba(16,185,129,0.08)' };
      default: return { text: 'Info', color: '#64748b', bg: '#f8fafc' };
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
            <div style={{ padding: '10px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '14px', display: 'flex', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
              <ShieldCheck size={24} color="#06b6d4" />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Audit Ledger
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
            Immutable, cryptographically verifiable log of all system actions.
          </p>
        </div>
      </div>

      {/* ─── Stats Row ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="dashboard-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>Total Events</p>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(6,182,212,0.3)' }}>
              <FileText size={20} color="#fff" />
            </div>
          </div>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>{recentActivity.length}</span>
        </div>

        <div className="dashboard-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>Vote Events</p>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
              <Vote size={20} color="#fff" />
            </div>
          </div>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>{recentActivity.filter(a => a.type === 'vote').length}</span>
        </div>

        <div className="dashboard-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>Security Alerts</p>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
              <AlertTriangle size={20} color="#fff" />
            </div>
          </div>
          <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>{recentActivity.filter(a => a.type === 'alert').length}</span>
        </div>
      </div>

      {/* ─── Table Panel ─── */}
      <div className="dashboard-panel">
        {/* Toolbar */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '340px', background: '#f8fafc', borderRadius: '12px', padding: '10px 16px', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search hash or message..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#0f172a', outline: 'none', width: '100%', fontSize: '0.9rem', fontFamily: 'inherit' }} 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Filter size={16} color="#94a3b8" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: '#f8fafc', color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
            >
              <option value="all">All Events</option>
              <option value="vote">Voting Events</option>
              <option value="system">System Actions</option>
              <option value="alert">Security Alerts</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Type</th>
                <th style={{ width: '140px' }}>Timestamp</th>
                <th>Event Description</th>
                <th style={{ width: '220px' }}>Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                    <ShieldCheck size={40} style={{ opacity: 0.15, marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
                    No audit logs found matching criteria.
                  </td>
                </tr>
              ) : filteredLogs.map((log) => {
                const label = getLabelForType(log.type);
                return (
                  <tr key={log.id} style={{ transition: 'background 0.2s' }}>
                    <td>
                      <div style={{ background: getColorForType(log.type), width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getIconForType(log.type)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: 500, fontSize: '0.88rem' }}>
                        <Clock size={14} color="#94a3b8" />
                        {log.time}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 600, color: log.type === 'alert' ? '#ef4444' : '#0f172a', fontSize: '0.92rem' }}>{log.message}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: label.bg, color: label.color, textTransform: 'uppercase', letterSpacing: '0.03em', flexShrink: 0 }}>
                          {label.text}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Hash size={13} color="#94a3b8" />
                        <code style={{ fontFamily: "'Courier New', Courier, monospace", background: '#f1f5f9', padding: '5px 10px', borderRadius: '8px', fontSize: '0.82rem', color: '#475569', fontWeight: 600, letterSpacing: '0.02em', border: '1px solid #e2e8f0' }}>
                          {log.hash}
                        </code>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Showing {filteredLogs.length} of {recentActivity.length} events
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> All entries cryptographically signed
          </span>
        </div>
      </div>
    </div>
  );
}
