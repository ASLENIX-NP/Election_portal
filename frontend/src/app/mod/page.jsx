import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { AlertTriangle, KeyRound, RefreshCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ModDashboard() {
  const [resetPin, setResetPin] = useState('');
  const [resetStatus, setResetStatus] = useState(null);

  // Mock Flagged Data
  const flaggedActivity = [
    { id: 1, studentId: 'S-10492', issue: 'Multiple failed PIN attempts (5x)', time: '2 mins ago', severity: 'high' },
    { id: 2, studentId: 'S-22819', issue: 'Concurrent login from different IPs', time: '14 mins ago', severity: 'critical' },
    { id: 3, studentId: 'S-88412', issue: 'Invalid session token', time: '1 hr ago', severity: 'low' }
  ];

  const handleReset = (e) => {
    e.preventDefault();
    if (resetPin.trim()) {
      setResetStatus('success');
      setTimeout(() => setResetStatus(null), 3000);
      setResetPin('');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert color="var(--accent-pink)" /> Security Operations
          </h1>
          <p>Monitor election integrity and manage voter access.</p>
        </div>
        <div className="badge active" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)' }}>
          3 Active Alerts
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Flagged Activity Log */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Flagged Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {flaggedActivity.map(log => (
              <Card key={log.id} style={{ 
                borderLeft: log.severity === 'critical' ? '4px solid var(--danger)' : '4px solid var(--warning)',
                padding: '1.25rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <AlertTriangle color={log.severity === 'critical' ? 'var(--danger)' : 'var(--warning)'} size={24} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{log.studentId}</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{log.issue}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{log.time}</span>
                  <div style={{ marginTop: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Review</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Quick Actions</h2>
          <Card>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <KeyRound size={18} color="var(--accent-cyan)" /> Reset Voter PIN
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Invalidate the current PIN for a student and issue a new one.
            </p>
            <form onSubmit={handleReset}>
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Student ID (e.g. S-12345)"
                  value={resetPin}
                  onChange={(e) => setResetPin(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <RefreshCcw size={16} /> Force Reset PIN
              </button>
            </form>
            
            {resetStatus === 'success' && (
              <div style={{ marginTop: '1rem', padding: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
                <CheckCircle2 size={18} /> PIN Reset successfully.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
