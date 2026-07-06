import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { ShieldCheck, MonitorPlay, XCircle, Search, CheckCircle2, UserCheck, Key, Lock, ArrowRight } from 'lucide-react';
import { useKioskContext } from '@/context/KioskContext';

export default function ModDashboard() {
  const { activeStudent, kioskStatus, roster, enableVoting, cancelVoting } = useKioskContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoster = roster.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* Premium Header */}
      <div className="page-header authentic-header" style={{ marginBottom: '2rem' }}>
        <div>
          <div className="header-title-row">
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
              <div style={{ padding: '10px', background: 'var(--text-primary)', color: 'var(--bg-color)', borderRadius: '14px', display: 'flex', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <ShieldCheck size={24} />
              </div>
              Authorization Desk
            </h1>
          </div>
          <p className="header-subtitle" style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Key size={16} style={{ color: 'var(--accent)' }} /> Manage secure terminal access for student voters.
          </p>
        </div>
        
        {/* Top Status Indicator */}
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '16px', 
          background: 'var(--surface-color)', 
          padding: '12px 20px', 
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)'
        }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Terminal State</span>
          <div style={{ width: '2px', height: '24px', background: 'var(--border-color)', borderRadius: '1px' }}></div>
          {kioskStatus === 'idle' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 800, fontSize: '0.95rem' }}>
              <div className="pulse-dot" style={{ width: 10, height: 10, background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div> SECURE & IDLE
            </span>
          )}
          {kioskStatus === 'voting' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 800, fontSize: '0.95rem' }}>
              <div className="pulse-dot" style={{ width: 10, height: 10, background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }}></div> VOTER IN BOOTH
            </span>
          )}
          {kioskStatus === 'completed' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontWeight: 800, fontSize: '0.95rem' }}>
              <div className="pulse-dot" style={{ width: 10, height: 10, background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }}></div> BALLOT CAST
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Roster & Check-In */}
        <Card className="authentic-card hover-lift" style={{ padding: 0, overflow: 'hidden', borderRadius: '20px' }}>
          
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Student Directory</h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Search and authorize eligible voters</p>
            </div>
            
            {/* Sleek Search */}
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search by name or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'var(--bg-color)', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--text-primary)',
                  padding: '12px 16px 12px 44px',
                  borderRadius: '12px',
                  outline: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--text-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto', minHeight: '500px', background: 'var(--bg-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--surface-color)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px 32px', fontWeight: 700 }}>Student ID</th>
                  <th style={{ padding: '16px 24px', fontWeight: 700 }}>Voter Name</th>
                  <th style={{ padding: '16px 24px', fontWeight: 700 }}>Grade</th>
                  <th style={{ padding: '16px 24px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '16px 32px', fontWeight: 700, textAlign: 'right' }}>Authorization</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.map((student, idx) => (
                  <tr key={student.id} style={{ 
                    borderBottom: '1px solid var(--border-color)', 
                    background: activeStudent === student.id ? 'rgba(14, 165, 233, 0.05)' : (idx % 2 === 0 ? 'transparent' : 'var(--surface-color)'),
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => { if(activeStudent !== student.id) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                  onMouseOut={(e) => { if(activeStudent !== student.id) e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'var(--surface-color)'; }}
                  >
                    <td style={{ padding: '20px 32px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 600 }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', display: 'inline-block', padding: '4px 8px', borderRadius: '6px' }}>
                        {student.id}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.05rem' }}>{student.name}</td>
                    <td style={{ padding: '20px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>{student.grade}</td>
                    <td style={{ padding: '20px 24px' }}>
                      {student.status === 'voted' ? (
                        <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.2)' }}>
                          <CheckCircle2 size={14} strokeWidth={3} /> COMPLETED
                        </span>
                      ) : activeStudent === student.id ? (
                        <span style={{ color: '#0ea5e9', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(14, 165, 233, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                           <Key size={14} /> AUTHORIZED
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, padding: '6px 12px', background: 'var(--surface-hover)', borderRadius: '20px' }}>Pending</span>
                      )}
                    </td>
                    <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                      {student.status === 'voted' ? (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Lock size={14} /> Locked
                        </span>
                      ) : activeStudent === student.id ? (
                        <button 
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }} 
                          onClick={cancelVoting}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = 'var(--danger)'; }}
                        >
                          <XCircle size={16} /> Revoke
                        </button>
                      ) : (
                        <button 
                          style={{ background: 'var(--text-primary)', border: 'none', color: 'var(--bg-color)', padding: '8px 20px', borderRadius: '10px', cursor: activeStudent ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: 700, opacity: activeStudent ? 0.3 : 1, transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          onClick={() => enableVoting(student.id)}
                          disabled={!!activeStudent} 
                          onMouseOver={(e) => { if(!activeStudent) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.1)'; } }}
                          onMouseOut={(e) => { if(!activeStudent) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; } }}
                        >
                          Enable <ArrowRight size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredRoster.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-secondary)' }}>
                      <div style={{ background: 'var(--surface-hover)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Search size={32} style={{ opacity: 0.5 }} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Students Found</h3>
                      <p>Try adjusting your search terms or verify the student ID.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Active Session Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
          <Card style={{ 
            padding: 0,
            overflow: 'hidden',
            borderRadius: '20px',
            background: activeStudent ? 'linear-gradient(145deg, rgba(14, 165, 233, 0.1), var(--surface-color))' : 'var(--surface-color)',
            border: activeStudent ? '1px solid rgba(14, 165, 233, 0.4)' : '1px solid var(--border-color)',
            boxShadow: activeStudent ? '0 10px 40px rgba(14, 165, 233, 0.15)' : 'none',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            {/* Header portion of card */}
            <div style={{ background: activeStudent ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.02)', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: activeStudent ? '#0ea5e9' : 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MonitorPlay size={20} />
                {activeStudent ? 'Active Terminal Session' : 'Terminal Locked'}
              </h2>
            </div>
            
            <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              {activeStudent ? (
                <div style={{ animation: 'fadeUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                    <div className="pulse-dot" style={{ position: 'absolute', top: -5, right: -5, width: 14, height: 14, background: '#0ea5e9', boxShadow: '0 0 12px #0ea5e9' }}></div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', borderRadius: '24px', background: 'rgba(14, 165, 233, 0.1)', border: '2px solid rgba(14, 165, 233, 0.3)' }}>
                      <UserCheck size={40} color="#0ea5e9" />
                    </div>
                  </div>
                  
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Authorized Voter</p>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
                    {roster.find(s => s.id === activeStudent)?.name}
                  </div>
                  <div style={{ display: 'inline-block', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '8px', fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '2.5rem' }}>
                    {activeStudent}
                  </div>
                  
                  <div style={{ background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.1), transparent)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'left' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.95rem', margin: 0, marginBottom: '8px', fontWeight: 700 }}>
                      <div className="pulse-dot" style={{ width: 8, height: 8, background: '#f59e0b', boxShadow: 'none' }}></div> Awaiting Authentication
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                      Voter has 5 minutes to authenticate at the physical terminal before this session auto-expires.
                    </p>
                  </div>

                  <button 
                    style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', padding: '14px', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                    onClick={cancelVoting}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <XCircle size={20} /> Revoke Authorization
                  </button>
                </div>
              ) : (
                <div style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', borderRadius: '24px', background: 'var(--surface-hover)', border: '1px dashed var(--border-color)', marginBottom: '2rem' }}>
                    <ShieldCheck size={40} style={{ opacity: 0.3 }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Terminal Secured</h3>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '250px', margin: '0 auto' }}>Search the directory and authorize a voter to begin a secure session.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
