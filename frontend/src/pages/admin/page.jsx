import { useState, useMemo } from 'react';
import { Card } from '@/components/common/Card';
import { Users, UserCheck, Activity, Download, FileText, TrendingUp, ShieldCheck, CheckCircle2, Award, Bell, PauseCircle, AlertTriangle, ShieldAlert, Upload, ChevronRight, PlayCircle } from 'lucide-react';
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
    { label: 'Total Eligible Voters', value: totalEligible.toLocaleString(), icon: Users, color: 'var(--accent-cyan)', trend: null },
    { label: 'Votes Cast', value: totalVotes.toLocaleString(), icon: UserCheck, color: 'var(--success)', trend: '+Live' },
    { label: 'Turnout Rate', value: turnout.toFixed(1) + '%', icon: Activity, color: 'var(--accent-pink)', trend: '+Live' }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* Premium Header */}
      <div className="page-header authentic-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="header-title-row">
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{electionTitle || 'Election Control Center'}</h1>
            {status === 'Active' ? (
              <span className="status-badge pulse-badge" style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                <span className="pulse-dot"></span>
                LIVE SYSTEM
              </span>
            ) : (
              <span className="status-badge" style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {status.toUpperCase()}
              </span>
            )}
          </div>
          <p className="header-subtitle" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--success)" style={{ verticalAlign: 'middle', marginRight: '4px', display: 'inline-block' }} /> 
            End-to-end encrypted voting process • {academicYear}
          </p>
        </div>
        
        {/* Relocated Quick Actions & Exports */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
          {showUploader ? (
             <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', width: '350px' }}>
                <CsvUploader onComplete={() => setShowUploader(false)} />
             </div>
          ) : (
             <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary text-sm" style={{ padding: '0.5rem 0.75rem', borderRadius: '10px' }} onClick={() => setShowUploader(true)} title="Import Live Votes">
                  <Upload size={16} /> Import CSV
                </button>
                <button className="btn btn-secondary text-sm" style={{ padding: '0.5rem 0.75rem', borderRadius: '10px' }} title="Send Reminders">
                  <Bell size={16} /> Remind
                </button>
                {status === 'Active' ? (
                  <button className="btn text-sm" style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }} onClick={() => setStatus('Paused')} title="Pause Election">
                    <PauseCircle size={16} /> Pause
                  </button>
                ) : (
                  <button className="btn text-sm" style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }} onClick={() => setStatus('Active')} title="Resume Election">
                    <PlayCircle size={16} /> Resume
                  </button>
                )}
             </div>
          )}
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ borderRadius: '10px' }} onClick={() => generateElectionCSV(candidates)}>
              <FileText size={16} /> Export Data
            </button>
            <button className="btn btn-primary" onClick={() => generateElectionPDF(stats, candidates)} style={{ background: 'var(--text-primary)', color: 'var(--bg-color)', borderRadius: '10px' }}>
              <Download size={16} /> Official Report
            </button>
          </div>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <Card key={i} className="authentic-card hover-lift" style={{ padding: '1.5rem', background: 'linear-gradient(145deg, var(--surface-color), var(--surface-hover))', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{stat.label}</h3>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={20} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.03em' }}>{stat.value}</div>
              {stat.trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 700, paddingBottom: '6px' }}>
                  <TrendingUp size={14} strokeWidth={3} /> {stat.trend}
                </div>
              )}
            </div>
            {i === 2 && (
               <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', marginTop: '1.5rem', overflow: 'hidden' }}>
                 <div style={{ height: '100%', width: `${turnout}%`, background: stat.color, borderRadius: '3px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
               </div>
            )}
          </Card>
        ))}
      </div>

      {/* Bento Box Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Col: Leaderboard */}
        <Card className="authentic-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '16px' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>Live Leaderboard</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Real-time candidate standings</p>
            </div>
            <select 
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', outline: 'none' }}
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
            >
              <option value="All Positions">All Positions</option>
              <option value="President">President</option>
              <option value="Vice President">Vice President</option>
              <option value="Student Council Representatives">Student Council Representatives</option>
            </select>
          </div>

          <div style={{ padding: '1rem' }}>
            {filteredData.sort((a, b) => b.votes - a.votes).map((candidate, idx) => {
              const positionTotal = candidates.filter(c => c.position === candidate.position).reduce((acc, curr) => acc + curr.votes, 0);
              const percentage = positionTotal > 0 ? ((candidate.votes / positionTotal) * 100).toFixed(1) : 0;
              const isLeading = idx === 0 && selectedPosition !== 'All Positions';

              return (
                <div key={candidate.id} style={{ 
                  display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem', borderRadius: '12px',
                  background: isLeading ? 'linear-gradient(to right, rgba(245, 158, 11, 0.05), transparent)' : 'transparent',
                  border: isLeading ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid transparent',
                  marginBottom: '0.5rem', transition: 'all 0.2s ease'
                }}>
                  {/* Rank / Avatar */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${candidate.color}20`, color: candidate.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', border: `2px solid ${candidate.color}40` }}>
                      {candidate.avatar}
                    </div>
                    {isLeading && (
                      <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#f59e0b', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(245,158,11,0.4)' }}>
                        <Award size={12} />
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {candidate.name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, padding: '2px 8px', borderRadius: '10px', background: 'var(--surface-hover)', display: 'inline-block' }}>{candidate.position}</span>
                  </div>
                  
                  {/* Stats & Bar */}
                  <div style={{ width: '140px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{candidate.votes.toLocaleString()}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>({percentage}%)</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--surface-hover)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percentage}%`, background: candidate.color, borderRadius: '2px', transition: 'width 1s ease' }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredData.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No candidates found for this position.
              </div>
            )}
          </div>
        </Card>

        {/* Right Col: Demographics & Security Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <Card className="authentic-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '16px' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Demographic Turnout</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Votes by Grade Level</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <DemographicsWidget data={demoData} />
            </div>
          </Card>

          <Card className="authentic-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '16px' }}>
             <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldAlert size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Security Timeline</h3>
             </div>
             
             <div style={{ padding: '1.5rem', maxHeight: '350px', overflowY: 'auto' }}>
               <div style={{ position: 'relative' }}>
                 {/* Timeline Line */}
                 <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-color)' }}></div>
                 
                 {recentActivity.map((activity, idx) => (
                   <div key={activity.id} style={{ display: 'flex', gap: '1rem', marginBottom: idx === recentActivity.length - 1 ? '0' : '1.5rem', position: 'relative', zIndex: 1 }}>
                     
                     <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-color)', border: `2px solid ${activity.type === 'alert' ? 'var(--danger)' : activity.type === 'vote' ? 'var(--success)' : 'var(--accent-cyan)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       {activity.type === 'vote' ? <CheckCircle2 size={12} color="var(--success)" /> : 
                        activity.type === 'alert' ? <AlertTriangle size={12} color="var(--danger)" /> :
                        <ShieldCheck size={12} color="var(--accent-cyan)" />}
                     </div>
                     
                     <div style={{ flex: 1 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: activity.type === 'alert' ? 'var(--danger)' : 'var(--text-primary)', margin: 0 }}>{activity.message}</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{activity.time}</span>
                       </div>
                       <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace', opacity: 0.6, background: 'var(--surface-hover)', padding: '2px 6px', borderRadius: '4px' }}>[{activity.hash}]</span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'var(--surface-hover)' }}>
               <button className="btn btn-secondary text-sm w-full" style={{ justifyContent: 'center', background: 'transparent', border: '1px solid var(--border-color)' }}>
                  View Full Audit Ledger <ChevronRight size={14} />
               </button>
             </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
