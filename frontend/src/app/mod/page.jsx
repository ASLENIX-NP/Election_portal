import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { ShieldCheck, MonitorPlay, XCircle, Search, CheckCircle2, UserCheck } from 'lucide-react';
import { useKioskContext } from '../../context/KioskContext';

export default function ModDashboard() {
  const { activeStudent, kioskStatus, roster, enableVoting, cancelVoting } = useKioskContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoster = roster.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '1rem' }}>
      {/* Premium Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.8rem', fontWeight: '600', letterSpacing: '-0.02em', margin: 0 }}>
            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex' }}>
              <ShieldCheck color="var(--accent)" size={24} />
            </div>
            Kiosk Control Desk
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1rem' }}>
            Securely verify and enable students for the physical voting terminal.
          </p>
        </div>
        
        {/* Top Status Indicator */}
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '12px', 
          background: 'var(--surface-color)', 
          padding: '10px 16px', 
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Terminal Status</span>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
          {kioskStatus === 'idle' && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem' }}><div style={{width:8, height:8, borderRadius:'50%', background:'var(--success)', boxShadow:'0 0 8px var(--success)'}}></div> IDLE</span>}
          {kioskStatus === 'voting' && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#eab308', fontWeight: 600, fontSize: '0.9rem' }}><div style={{width:8, height:8, borderRadius:'50%', background:'#eab308', boxShadow:'0 0 8px #eab308'}}></div> IN USE</span>}
          {kioskStatus === 'completed' && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem' }}><div style={{width:8, height:8, borderRadius:'50%', background:'#3b82f6', boxShadow:'0 0 8px #3b82f6'}}></div> SUCCESS</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Roster & Check-In */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Student Roster</h2>
            
            {/* Sleek Search */}
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search by Name or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'var(--background-color)', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--text-primary)',
                  padding: '10px 16px 10px 36px',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '0.9rem',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto', minHeight: '400px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Student ID</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Grade</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.map((student, idx) => (
                  <tr key={student.id} style={{ 
                    borderBottom: '1px solid var(--border-color)', 
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseOut={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                  >
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.95rem' }}>{student.id}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-primary)', fontWeight: 500 }}>{student.name}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{student.grade}</td>
                    <td style={{ padding: '16px 24px' }}>
                      {student.status === 'voted' ? (
                        <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                          <CheckCircle2 size={14} /> Voted
                        </span>
                      ) : activeStudent === student.id ? (
                        <span style={{ color: '#06b6d4', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(6,182,212,0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                           Unlocked
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Pending</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      {student.status === 'voted' ? (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Completed</span>
                      ) : activeStudent === student.id ? (
                        <button 
                          style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s' }} 
                          onClick={cancelVoting}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--danger)'; }}
                        >
                          Revoke Access
                        </button>
                      ) : (
                        <button 
                          style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 16px', borderRadius: '6px', cursor: activeStudent ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 500, opacity: activeStudent ? 0.5 : 1, transition: 'all 0.2s' }}
                          onClick={() => enableVoting(student.id)}
                          disabled={!!activeStudent} 
                          onMouseOver={(e) => { if(!activeStudent) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; } }}
                          onMouseOut={(e) => { if(!activeStudent) { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                        >
                          Enable Voter
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredRoster.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                      <Search size={32} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
                      No students found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Active Session Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ 
            padding: 0,
            overflow: 'hidden',
            border: activeStudent ? '1px solid rgba(6,182,212,0.4)' : '1px solid var(--border-color)',
            boxShadow: activeStudent ? '0 8px 32px rgba(6,182,212,0.1)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            {/* Header portion of card */}
            <div style={{ background: activeStudent ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.02)', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: activeStudent ? '#06b6d4' : 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MonitorPlay size={18} />
                {activeStudent ? 'Active Kiosk Session' : 'Kiosk Locked'}
              </h2>
            </div>
            
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
              {activeStudent ? (
                <div style={{ animation: 'fadeUp 0.3s ease-out' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', marginBottom: '1.5rem' }}>
                    <UserCheck size={32} color="#06b6d4" />
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Voting Enabled For</p>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0.5rem 0 0.25rem 0' }}>
                    {roster.find(s => s.id === activeStudent)?.name}
                  </div>
                  <div style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                    {activeStudent}
                  </div>
                  
                  <div style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <p style={{ color: '#eab308', fontSize: '0.85rem', margin: 0, marginBottom: '6px', fontWeight: 500 }}>
                      Awaiting authentication at the voting terminal...
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0 }}>
                      This session will automatically expire in 5 minutes.
                    </p>
                  </div>

                  <button 
                    style={{ width: '100%', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                    onClick={cancelVoting}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--danger)'; }}
                  >
                    <XCircle size={18} /> Cancel Session
                  </button>
                </div>
              ) : (
                <div style={{ color: 'var(--text-secondary)', padding: '1rem 0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={32} style={{ opacity: 0.5 }} />
                  </div>
                  <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Terminal is secured.</p>
                  <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>Search the roster and enable a voter to begin a secure session.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
