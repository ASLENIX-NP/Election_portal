import { useState, useMemo } from 'react';
import { Users, UserCheck, Activity, Download, FileText, TrendingUp, ShieldCheck, CheckCircle2, Award, Bell, PauseCircle, AlertTriangle, ShieldAlert, Upload, ChevronRight, PlayCircle, BarChart3, Clock, Zap, MonitorUp, MonitorOff, Percent } from 'lucide-react';
import { generateElectionPDF, generateElectionCSV } from '@/utils/ReportGenerator';
import { useElection } from '@/context/ElectionContext';
import DemographicsWidget from '@/components/admin/DemographicsWidget';
import CsvUploader from '@/components/admin/CsvUploader';
import './dashboard.css';

export default function AdminDashboard() {
  const { 
    electionTitle, academicYear, status,
    totalVotes, totalEligible, candidates, 
    demoData, recentActivity, setStatus,
    isPublished, togglePublish
  } = useElection();
  
  const turnout = totalEligible > 0 ? (totalVotes / totalEligible) * 100 : 0;
  
  const [selectedPosition, setSelectedPosition] = useState('All Positions');
  const [showUploader, setShowUploader] = useState(false);

  const filteredData = useMemo(() => {
    if (selectedPosition === 'All Positions') return candidates;
    return candidates.filter(c => c.position === selectedPosition);
  }, [candidates, selectedPosition]);

  const positions = [...new Set(candidates.map(c => c.position))];

  const stats = [
    { label: 'Total Eligible Voters', value: totalEligible.toLocaleString() },
    { label: 'Votes Cast', value: totalVotes.toLocaleString() },
    { label: 'Turnout Rate', value: turnout.toFixed(1) + '%' },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      
      {/* ─── Page Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#0f172a', margin: 0 }}>
              {electionTitle || 'Election Dashboard'}
            </h1>
            {status === 'Active' ? (
              <span style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '5px', 
                padding: '3px 10px', borderRadius: '999px', fontSize: '0.675rem', fontWeight: 600, 
                background: 'rgba(5, 150, 105, 0.06)', color: '#059669', 
                border: '1px solid rgba(5, 150, 105, 0.12)', letterSpacing: '0.04em' 
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669', animation: 'pulse 2s infinite' }}></span>
                LIVE
              </span>
            ) : (
              <span style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '5px', 
                padding: '3px 10px', borderRadius: '999px', fontSize: '0.675rem', fontWeight: 600, 
                background: 'rgba(220, 38, 38, 0.06)', color: '#dc2626', 
                border: '1px solid rgba(220, 38, 38, 0.1)', letterSpacing: '0.04em' 
              }}>
                {status.toUpperCase()}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            {academicYear} • End-to-end encrypted
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          {showUploader ? (
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.06)', width: '340px' }}>
              <CsvUploader onComplete={() => setShowUploader(false)} />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setShowUploader(true)}>
                <Upload size={14} /> Import
              </button>
              {status === 'Active' ? (
                <button className="btn" style={{ padding: '6px 12px', background: 'rgba(220,38,38,0.05)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.1)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }} onClick={() => setStatus('Paused')}>
                  <PauseCircle size={14} /> Pause
                </button>
              ) : (
                <button className="btn" style={{ padding: '6px 12px', background: 'rgba(5,150,105,0.05)', color: '#059669', border: '1px solid rgba(5,150,105,0.1)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }} onClick={() => setStatus('Active')}>
                  <PlayCircle size={14} /> Resume
                </button>
              )}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              className="btn" 
              onClick={togglePublish} 
              style={{ 
                background: isPublished ? 'rgba(5,150,105,0.05)' : '#fafbfc', 
                color: isPublished ? '#059669' : '#64748b', 
                borderRadius: '6px', border: isPublished ? '1px solid rgba(5,150,105,0.12)' : '1px solid var(--border-color)', 
                fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit', padding: '6px 14px' 
              }}
            >
              {isPublished ? <MonitorOff size={14} /> : <MonitorUp size={14} />} {isPublished ? 'Unpublish' : 'Push to Portal'}
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }} onClick={() => generateElectionCSV(candidates)}>
              <FileText size={14} /> CSV
            </button>
            <button className="btn" onClick={() => generateElectionPDF(stats, candidates)} style={{ background: '#0f172a', color: '#fff', border: 'none', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit', padding: '6px 14px' }}>
              <Download size={14} /> Report
            </button>
          </div>
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Eligible Voters */}
        <div className="dashboard-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Eligible Voters</p>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={17} color="#2563eb" strokeWidth={1.8} />
            </div>
          </div>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>{totalEligible.toLocaleString()}</span>
        </div>

        {/* Votes Cast */}
        <div className="dashboard-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Votes Cast</p>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(5, 150, 105, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={17} color="#059669" strokeWidth={1.8} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>{totalVotes.toLocaleString()}</span>
            <span style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#059669', 
              fontSize: '0.72rem', fontWeight: 600, background: 'rgba(5,150,105,0.06)', 
              padding: '2px 6px', borderRadius: '999px', marginBottom: '2px' 
            }}>
              <TrendingUp size={11} strokeWidth={2.5} /> Live
            </span>
          </div>
        </div>

        {/* Turnout */}
        <div className="dashboard-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Turnout</p>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(124, 58, 237, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Percent size={17} color="#7c3aed" strokeWidth={1.8} />
            </div>
          </div>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>{turnout.toFixed(1)}%</span>
          <div style={{ height: '3px', background: 'rgba(0,0,0,0.04)', borderRadius: '2px', marginTop: '0.75rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${turnout}%`, background: '#7c3aed', borderRadius: '2px', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
          </div>
        </div>
      </div>

      {/* ─── Main Grid: Leaderboard + Right Column ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1rem', alignItems: 'start' }}>
        
        {/* ─── Leaderboard ─── */}
        <div className="dashboard-panel">
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', margin: '0 0 2px 0' }}>
                Live Standings
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Real-time vote count</p>
            </div>
            <select 
              style={{ 
                padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', 
                background: '#fafbfc', color: '#0f172a', fontWeight: 500, fontSize: '0.78rem', 
                cursor: 'pointer', outline: 'none', fontFamily: 'inherit' 
              }}
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
            >
              <option value="All Positions">All Positions</option>
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ padding: '0.5rem' }}>
            {filteredData.sort((a, b) => b.votes - a.votes).map((candidate, idx) => {
              const positionTotal = candidates.filter(c => c.position === candidate.position).reduce((acc, curr) => acc + curr.votes, 0);
              const percentage = positionTotal > 0 ? ((candidate.votes / positionTotal) * 100).toFixed(1) : 0;
              const isLeading = idx === 0 && selectedPosition !== 'All Positions';

              return (
                <div key={candidate.id} className={`leaderboard-item ${isLeading ? 'leading' : ''}`}>
                  {/* Rank */}
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '6px', 
                    background: idx < 3 ? ['#fbbf24', '#94a3b8', '#d97706'][idx] : '#f1f5f9', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '0.65rem', fontWeight: 700, 
                    color: idx < 3 ? '#fff' : '#94a3b8', flexShrink: 0 
                  }}>
                    {idx + 1}
                  </div>

                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ 
                      width: '38px', height: '38px', borderRadius: '10px', 
                      background: `${candidate.color}0A`, color: candidate.color, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontWeight: 700, fontSize: '0.95rem', border: `1.5px solid ${candidate.color}20` 
                    }}>
                      {candidate.avatar}
                    </div>
                    {isLeading && (
                      <div style={{ 
                        position: 'absolute', top: '-4px', right: '-4px', 
                        background: '#fbbf24', color: '#fff', borderRadius: '50%', 
                        width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        border: '1.5px solid #fff' 
                      }}>
                        <Award size={9} />
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', margin: '0 0 2px 0' }}>
                      {candidate.name}
                    </h4>
                    <span style={{ 
                      fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500, 
                      padding: '1px 6px', borderRadius: '4px', background: '#f8f9fa', 
                      display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.04em' 
                    }}>{candidate.position}</span>
                  </div>
                  
                  {/* Stats */}
                  <div style={{ width: '120px', textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>{candidate.votes.toLocaleString()}</span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>({percentage}%)</span>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(0,0,0,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percentage}%`, background: candidate.color, borderRadius: '2px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredData.length === 0 && (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                <Activity size={28} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.85rem', margin: 0 }}>No candidates for this position.</p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Column ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Demographics */}
          <div className="dashboard-panel">
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', margin: '0 0 2px 0' }}>
                Turnout by Grade
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Live participation rates</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <DemographicsWidget data={demoData} />
            </div>
          </div>

          {/* Activity Feed */}
          <div className="dashboard-panel">
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                Recent Activity
              </h3>
            </div>
             
            <div style={{ padding: '0.75rem 1rem', maxHeight: '320px', overflowY: 'auto' }}>
              {recentActivity.map((activity) => (
                <div key={activity.id} className="timeline-item">
                  <div style={{ 
                    width: '28px', height: '28px', borderRadius: '7px', 
                    background: activity.type === 'alert' ? 'rgba(220,38,38,0.05)' : activity.type === 'vote' ? 'rgba(5,150,105,0.05)' : 'rgba(8,145,178,0.05)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                  }}>
                    {activity.type === 'vote' ? <CheckCircle2 size={14} color="#059669" /> : 
                     activity.type === 'alert' ? <AlertTriangle size={14} color="#dc2626" /> :
                     <ShieldCheck size={14} color="#0891b2" />}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 500, color: activity.type === 'alert' ? '#dc2626' : '#0f172a', margin: 0, lineHeight: 1.4 }}>{activity.message}</p>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: '8px' }}>
                        {activity.time}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#0891b2', fontFamily: "'SF Mono', 'Fira Code', monospace", background: 'rgba(8,145,178,0.04)', padding: '1px 5px', borderRadius: '3px' }}>{activity.hash}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-color)' }}>
              <button 
                className="btn btn-secondary w-full" 
                style={{ 
                  justifyContent: 'center', background: '#fafbfc', 
                  border: '1px solid var(--border-color)', color: '#64748b', 
                  padding: '7px', borderRadius: '8px', width: '100%', 
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, fontSize: '0.78rem' 
                }} 
              >
                View Full Audit <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
