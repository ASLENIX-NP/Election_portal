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
const dashboardStats = [
  {
    title: "Verified Today",
    value: 1248,
    color: "#2563EB",
    icon: "👤",
  },
  {
    title: "Currently Voting",
    value: 42,
    color: "#16A34A",
    icon: "🗳",
  },
  {
    title: "Open Alerts",
    value: 3,
    color: "#DC2626",
    icon: "🚨",
  },
  {
    title: "Support Requests",
    value: 5,
    color: "#F59E0B",
    icon: "📩",
  },
];
  return (
    <div>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert color="var(--accent-pink)" /> Security Operations
          </h1>
          <p>Monitor election integrity and manage voter access.</p>
        </div>

      </div>
         return (
  <div>

    {/* Page Header */}
    <div className="page-header" style={{ marginBottom: "2rem" }}>
      <div>
        <h1>Moderator Dashboard</h1>
        <p>
          Monitor voter verification, election activity, and security incidents.
        </p>
      </div>
    </div>

    {/* ADD THE DASHBOARD STATS HERE 👇 */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      {dashboardStats.map((stat) => (
        <Card
          key={stat.title}
          style={{
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "1.8rem",
              marginBottom: "12px",
            }}
          >
            {stat.icon}
          </div>

          <h2
            style={{
              margin: 0,
              color: stat.color,
              fontSize: "2rem",
            }}
          >
            {stat.value}
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: "var(--text-secondary)",
            }}
          >
            {stat.title}
          </p>
        </Card>
      ))}
    </div>

    {/* Existing Two-Column Layout */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "2rem",
      }}
    >
      ...
    </div>

  </div>
);
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

{/* Student Verification */}
<div>
  <h2
    style={{
      fontSize: "1.25rem",
      marginBottom: "1rem",
      color: "var(--text-primary)",
    }}
  >
    Student Verification
  </h2>

  <Card style={{ padding: "1.5rem" }}>
    <h3
      style={{
        fontSize: "1.1rem",
        marginBottom: "0.5rem",
      }}
    >
      Verify Student
    </h3>

    <p
      style={{
        color: "var(--text-secondary)",
        fontSize: "0.9rem",
        marginBottom: "1.5rem",
      }}
    >
      Search a student before allowing access to the voting booth.
    </p>

    <div className="form-group">
      <input
        className="form-control"
        type="text"
        placeholder="Enter Student ID"
      />
    </div>

    <button
      className="btn btn-primary"
      style={{
        width: "100%",
        justifyContent: "center",
      }}
    >
      Search Student
    </button>

    <hr style={{ margin: "24px 0" }} />

    <div style={{ display: "grid", gap: "14px" }}>
      <div>
        <small>Name</small>
        <div style={{ fontWeight: 600 }}>—</div>
      </div>

      <div>
        <small>Faculty</small>
        <div style={{ fontWeight: 600 }}>—</div>
      </div>

      <div>
        <small>Semester</small>
        <div style={{ fontWeight: 600 }}>—</div>
      </div>

      <div>
        <small>Verification Status</small>
        <div className="badge">Not Verified</div>
      </div>

      <div>
        <small>Voting Status</small>
        <div className="badge">Not Voted</div>
      </div>
    </div>

    <button
      className="btn btn-success"
      style={{
        marginTop: "24px",
        width: "100%",
        justifyContent: "center",
      }}
    >
      Verify Identity
    </button>
  </Card>
</div>
      </div>
    </div>
  );
}
