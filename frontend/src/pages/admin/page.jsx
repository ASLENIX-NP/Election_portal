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
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', position: 'relative' }}>
      
      {/* Background glow for premium feel */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '40%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
      
      {/* Premium Header */}
      <div className="page-header" style={{ alignItems: 'flex-start', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem' }}>
        <div>
          <div className="header-title-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{ padding: '12px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', display: 'flex', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <ShieldCheck size={28} color="var(--accent-cyan)" style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.5))' }} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              {electionTitle || 'Election Control Center'}
            </h1>
            {status === 'Active' ? (
              <span className="status-badge pulse-badge" style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, marginLeft: '8px', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}>
                <span className="pulse-dot"></span>
                LIVE SYSTEM
              </span>
            ) : (
              <span className="status-badge" style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', marginLeft: '8px' }}>
                {status.toUpperCase()}
              </span>
            )}
          </div>
          <p className="header-subtitle" style={{ fontSize: '1.05rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={18} color="var(--success)" style={{ verticalAlign: 'middle', marginRight: '6px', display: 'inline-block' }} /> 
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="glass-panel" 
            style={{ 
              padding: '1.75rem', 
              background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', 
              border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              animation: `fadeUp 0.5s ease-out ${i * 0.1}s backwards`
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 30px ${stat.color}20`; e.currentTarget.style.borderColor = `${stat.color}50`; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</h3>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 15px ${stat.color}20` }}>
                <stat.icon size={24} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              <div style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.04em' }}>{stat.value}</div>
              {stat.trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 700, paddingBottom: '8px', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '20px' }}>
                  <TrendingUp size={14} strokeWidth={3} /> {stat.trend}
                </div>
              )}
            </div>
            {i === 2 && (
               <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginTop: '1.5rem', overflow: 'hidden' }}>
                 <div style={{ height: '100%', width: `${turnout}%`, background: `linear-gradient(90deg, ${stat.color}, #f472b6)`, borderRadius: '4px', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 10px ${stat.color}80` }}></div>
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Bento Box Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Col: Leaderboard */}
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ padding: '1.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Live Leaderboard</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Real-time candidate standings</p>
            </div>
            <select 
              style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', outline: 'none', transition: 'all 0.2s ease', backdropFilter: 'blur(10px)' }}
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
                  display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1.25rem', borderRadius: '16px',
                  background: isLeading ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.08) 0%, rgba(255,255,255,0.02) 100%)' : 'rgba(255,255,255,0.02)',
                  border: isLeading ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255,255,255,0.03)',
                  marginBottom: '0.75rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative', overflow: 'hidden'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateX(6px)'; e.currentTarget.style.background = isLeading ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(255,255,255,0.04) 100%)' : 'rgba(255,255,255,0.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.background = isLeading ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.08) 0%, rgba(255,255,255,0.02) 100%)' : 'rgba(255,255,255,0.02)'; }}
                >
                  {isLeading && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--warning)', boxShadow: '0 0 10px var(--warning)' }}></div>}
                  
                  {/* Rank / Avatar */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `${candidate.color}20`, color: candidate.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.4rem', border: `2px solid ${candidate.color}50`, boxShadow: `0 0 15px ${candidate.color}30` }}>
                      {candidate.avatar}
                    </div>
                    {isLeading && (
                      <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(245,158,11,0.5)', border: '2px solid var(--surface-color)' }}>
                        <Award size={14} />
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', letterSpacing: '-0.01em' }}>
                      {candidate.name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, padding: '4px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{candidate.position}</span>
                  </div>
                  
                  {/* Stats & Bar */}
                  <div style={{ width: '160px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{candidate.votes.toLocaleString()}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>({percentage}%)</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percentage}%`, background: `linear-gradient(90deg, ${candidate.color}, ${candidate.color}dd)`, borderRadius: '3px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 10px ${candidate.color}80` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredData.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <Activity size={40} style={{ opacity: 0.3, marginBottom: '1rem', margin: '0 auto' }} />
                <p style={{ fontSize: '1.05rem' }}>No candidates found for this position.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Demographics & Security Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Demographic Turnout</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Live votes by grade level</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <DemographicsWidget data={demoData} />
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
             <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldAlert size={22} style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Security Timeline</h3>
             </div>
             
             <div style={{ padding: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
               <div style={{ position: 'relative', paddingLeft: '1rem' }}>
                 {/* Timeline Line */}
                 <div style={{ position: 'absolute', left: '26px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(255,255,255,0.08)' }}></div>
                 
                 {recentActivity.map((activity, idx) => (
                   <div key={activity.id} style={{ display: 'flex', gap: '1.25rem', marginBottom: idx === recentActivity.length - 1 ? '0' : '1.75rem', position: 'relative', zIndex: 1, animation: `fadeIn 0.5s ease-out ${idx * 0.1}s backwards` }}>
                     
                     <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(15,23,42,0.8)', border: `2px solid ${activity.type === 'alert' ? 'var(--danger)' : activity.type === 'vote' ? 'var(--success)' : 'var(--accent-cyan)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 10px ${activity.type === 'alert' ? 'rgba(239,68,68,0.3)' : activity.type === 'vote' ? 'rgba(16,185,129,0.3)' : 'rgba(6,182,212,0.3)'}` }}>
                       {activity.type === 'vote' ? <CheckCircle2 size={16} color="var(--success)" /> : 
                        activity.type === 'alert' ? <AlertTriangle size={16} color="var(--danger)" /> :
                        <ShieldCheck size={16} color="var(--accent-cyan)" />}
                     </div>
                     
                     <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: activity.type === 'alert' ? 'var(--danger)' : 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{activity.message}</p>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '12px' }}>{activity.time}</span>
                       </div>
                       <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'monospace', opacity: 0.8, background: 'rgba(6,182,212,0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(6,182,212,0.2)' }}>{activity.hash}</span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.1)' }}>
               <button className="btn btn-secondary text-sm w-full" style={{ justifyContent: 'center', background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)', color: 'var(--text-secondary)', padding: '0.75rem', borderRadius: '12px', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  View Full Audit Ledger <ChevronRight size={16} />
               </button>
             </div>
          </div>

        </div>
      </div>
      
      </div>
    </div>
  );
}
