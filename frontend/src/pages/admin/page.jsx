import { useState, useMemo } from 'react';
import { Users, UserCheck, Activity, Download, FileText, TrendingUp, ShieldCheck, CheckCircle2, Award, Bell, PauseCircle, AlertTriangle, ShieldAlert, Upload, ChevronRight, PlayCircle, BarChart3, Clock, Zap } from 'lucide-react';
import { generateElectionPDF, generateElectionCSV } from '@/utils/ReportGenerator';
import { useElection } from '@/context/ElectionContext';
import DemographicsWidget from '@/components/admin/DemographicsWidget';
import CsvUploader from '@/components/admin/CsvUploader';

export default function AdminDashboard() {
  const { 
    electionTitle, academicYear, status,
    totalVotes, totalEligible, candidates, 
    demoData, recentActivity, setStatus
  } = useElection();
  
  const turnout = totalEligible > 0 ? (totalVotes / totalEligible) * 100 : 0;
  
  const [selectedPosition, setSelectedPosition] = useState('All Positions');
  const [showUploader, setShowUploader] = useState(false);

  const filteredData = useMemo(() => {
    if (selectedPosition === 'All Positions') return candidates;
    return candidates.filter(c => c.position === selectedPosition);
  }, [candidates, selectedPosition]);

  const stats = [
    { label: 'Total Eligible Voters', value: totalEligible.toLocaleString(), icon: Users, gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', lightBg: 'rgba(59,130,246,0.08)', lightColor: '#3b82f6', trend: null },
    { label: 'Votes Cast', value: totalVotes.toLocaleString(), icon: UserCheck, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', lightBg: 'rgba(16,185,129,0.08)', lightColor: '#10b981', trend: '+Live' },
    { label: 'Turnout Rate', value: turnout.toFixed(1) + '%', icon: Activity, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', lightBg: 'rgba(139,92,246,0.08)', lightColor: '#8b5cf6', trend: '+Live' },
  ];

  const positions = [...new Set(candidates.map(c => c.position))];

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
              {electionTitle || 'Election Control Center'}
            </h1>
            {status === 'Active' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></span>
                LIVE
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                {status.toUpperCase()}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#10b981" /> End-to-end encrypted voting process • {academicYear}
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
          {showUploader ? (
             <div style={{ background: '#fff', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', width: '350px' }}>
                <CsvUploader onComplete={() => setShowUploader(false)} />
             </div>
          ) : (
             <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary text-sm" style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.85rem' }} onClick={() => setShowUploader(true)} title="Import Live Votes">
                  <Upload size={15} /> Import CSV
                </button>
                <button className="btn btn-secondary text-sm" style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.85rem' }} title="Send Reminders">
                  <Bell size={15} /> Remind
                </button>
                {status === 'Active' ? (
                  <button className="btn text-sm" style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }} onClick={() => setStatus('Paused')}>
                    <PauseCircle size={15} /> Pause
                  </button>
                ) : (
                  <button className="btn text-sm" style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.15)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }} onClick={() => setStatus('Active')}>
                    <PlayCircle size={15} /> Resume
                  </button>
                )}
             </div>
          )}
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ borderRadius: '10px', fontSize: '0.85rem' }} onClick={() => generateElectionCSV(candidates)}>
              <FileText size={15} /> Export Data
            </button>
            <button className="btn" onClick={() => generateElectionPDF(stats, candidates)} style={{ background: '#0f172a', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', padding: '10px 18px', boxShadow: '0 4px 12px rgba(15,23,42,0.2)' }}>
              <Download size={15} /> Official Report
            </button>
          </div>
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <div 
            key={i}
            style={{ 
              padding: '1.5rem', 
              background: '#ffffff', 
              border: '1px solid var(--border-color)', 
              borderRadius: '16px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.06)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>{stat.label}</p>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: stat.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${stat.lightColor}30` }}>
                <stat.icon size={20} color="#fff" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>{stat.value}</span>
              {stat.trend && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, background: 'rgba(16,185,129,0.08)', padding: '4px 8px', borderRadius: '20px', marginBottom: '4px' }}>
                  <TrendingUp size={13} strokeWidth={3} /> {stat.trend}
                </span>
              )}
            </div>
            {/* Turnout progress bar */}
            {i === 2 && (
               <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', marginTop: '1rem', overflow: 'hidden' }}>
                 <div style={{ height: '100%', width: `${turnout}%`, background: stat.gradient, borderRadius: '3px', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
               </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── Main Grid: Leaderboard + Right Column ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.25rem', alignItems: 'start' }}>
        
        {/* ─── Leaderboard ─── */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={20} color="#3b82f6" /> Live Leaderboard
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Real-time candidate standings</p>
            </div>
            <select 
              style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#f8fafc', color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
            >
              <option value="All Positions">All Positions</option>
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Candidate List */}
          <div style={{ padding: '0.75rem' }}>
            {filteredData.sort((a, b) => b.votes - a.votes).map((candidate, idx) => {
              const positionTotal = candidates.filter(c => c.position === candidate.position).reduce((acc, curr) => acc + curr.votes, 0);
              const percentage = positionTotal > 0 ? ((candidate.votes / positionTotal) * 100).toFixed(1) : 0;
              const isLeading = idx === 0 && selectedPosition !== 'All Positions';

              return (
                <div key={candidate.id} style={{ 
                  display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', gap: '1rem', borderRadius: '12px',
                  background: isLeading ? 'linear-gradient(90deg, rgba(245,158,11,0.06) 0%, transparent 100%)' : 'transparent',
                  border: isLeading ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                  marginBottom: '0.25rem', transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                onMouseOver={(e) => { if (!isLeading) e.currentTarget.style.background = '#f8fafc'; }}
                onMouseOut={(e) => { if (!isLeading) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Rank */}
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: idx < 3 ? ['linear-gradient(135deg, #fbbf24, #f59e0b)', 'linear-gradient(135deg, #94a3b8, #64748b)', 'linear-gradient(135deg, #d97706, #b45309)'][idx] : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: idx < 3 ? '#fff' : '#64748b', flexShrink: 0 }}>
                    {idx + 1}
                  </div>

                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${candidate.color}15`, color: candidate.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', border: `2px solid ${candidate.color}30` }}>
                      {candidate.avatar}
                    </div>
                    {isLeading && (
                      <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(245,158,11,0.4)', border: '2px solid #fff' }}>
                        <Award size={11} />
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 3px 0' }}>
                      {candidate.name}
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', background: '#f1f5f9', display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{candidate.position}</span>
                  </div>
                  
                  {/* Stats & Bar */}
                  <div style={{ width: '140px', textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{candidate.votes.toLocaleString()}</span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>({percentage}%)</span>
                    </div>
                    <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percentage}%`, background: candidate.color, borderRadius: '3px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredData.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <Activity size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '0.95rem', margin: 0 }}>No candidates found for this position.</p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Column ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Demographics */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="#8b5cf6" /> Demographic Turnout
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Live votes by grade level</p>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <DemographicsWidget data={demoData} />
            </div>
          </div>

          {/* Security Timeline */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
             <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} color="#06b6d4" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Security Timeline</h3>
             </div>
             
             <div style={{ padding: '1rem 1.25rem', maxHeight: '380px', overflowY: 'auto' }}>
               {recentActivity.map((activity, idx) => (
                 <div key={activity.id} style={{ display: 'flex', gap: '12px', marginBottom: idx === recentActivity.length - 1 ? '0' : '1rem', position: 'relative' }}>
                   
                   {/* Timeline dot */}
                   <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: activity.type === 'alert' ? 'rgba(239,68,68,0.08)' : activity.type === 'vote' ? 'rgba(16,185,129,0.08)' : 'rgba(6,182,212,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     {activity.type === 'vote' ? <CheckCircle2 size={16} color="#10b981" /> : 
                      activity.type === 'alert' ? <AlertTriangle size={16} color="#ef4444" /> :
                      <ShieldCheck size={16} color="#06b6d4" />}
                   </div>
                   
                   {/* Content */}
                   <div style={{ flex: 1, minWidth: 0 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: activity.type === 'alert' ? '#ef4444' : '#0f172a', margin: 0, lineHeight: 1.4 }}>{activity.message}</p>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={11} /> {activity.time}
                        </span>
                     </div>
                     <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontFamily: 'monospace', background: 'rgba(6,182,212,0.06)', padding: '2px 6px', borderRadius: '4px' }}>{activity.hash}</span>
                   </div>
                 </div>
               ))}
             </div>

             <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-color)' }}>
               <button 
                 className="btn btn-secondary text-sm w-full" 
                 style={{ justifyContent: 'center', background: '#f8fafc', border: '1px dashed var(--border-color)', color: '#64748b', padding: '10px', borderRadius: '10px', transition: 'all 0.3s ease', width: '100%', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem' }} 
                 onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }} 
                 onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
               >
                  View Full Audit Ledger <ChevronRight size={15} />
               </button>
             </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
