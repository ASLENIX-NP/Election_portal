import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { ShieldCheck, Search, Filter, AlertTriangle, FileText, Vote } from 'lucide-react';
import { useElection } from '@/context/ElectionContext';

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
      case 'vote': return <Vote size={18} color="var(--accent)" />;
      case 'alert': return <AlertTriangle size={18} color="var(--danger)" />;
      case 'system': return <ShieldCheck size={18} color="var(--success)" />;
      default: return <FileText size={18} color="var(--text-secondary)" />;
    }
  };

  const getColorForType = (type) => {
    switch(type) {
      case 'vote': return 'rgba(59, 130, 246, 0.1)';
      case 'alert': return 'rgba(239, 68, 68, 0.1)';
      case 'system': return 'rgba(16, 185, 129, 0.1)';
      default: return 'var(--surface-hover)';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header authentic-header">
        <div>
          <div className="header-title-row">
            <h1>Audit Ledger</h1>
          </div>
          <p className="header-subtitle">Immutable, cryptographically verifiable log of all system actions.</p>
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
          <div className="form-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '320px', background: 'var(--surface-hover)', borderRadius: '8px', padding: '10px 16px' }}>
            <Search size={18} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search hash or message..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }} 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Filter size={18} color="var(--text-secondary)" />
            <select 
              className="form-control" 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)' }}
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
            <thead style={{ background: 'var(--surface-hover)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', width: '60px' }}>Type</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Timestamp</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Event Description</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No audit logs found matching criteria.</td>
                </tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'default' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: getColorForType(log.type), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getIconForType(log.type)}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>{log.time}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>{log.message}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontFamily: 'monospace', background: 'var(--surface-hover)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {log.hash}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
