import { useElection } from '@/context/ElectionContext';
import { MonitorPlay, Activity, Award, BarChart3, TrendingUp, Shield, HelpCircle, Users, CheckCircle2 } from 'lucide-react';
import React from 'react';
import './portal.css';

export default function PublicPortal() {
  const { 
    isPublished, electionTitle, academicYear, 
    candidates, totalVotes, totalEligible, positions 
  } = useElection();

  const turnout = totalEligible > 0 ? ((totalVotes / totalEligible) * 100).toFixed(1) : 0;

  if (!isPublished) {
    return (
      <div className="portal-container waiting-mode">
        <div className="portal-bg-glows">
          <div className="bg-glow blue"></div>
          <div className="bg-glow purple"></div>
        </div>
        
        <div className="waiting-screen">
          <div className="portal-logo-badge">
            <Shield size={28} className="shield-icon" />
          </div>
          <div className="pulse-circle">
            <MonitorPlay size={36} color="#fff" />
          </div>
          <h2 className="portal-main-heading">
            Results Not Yet Published
          </h2>
          <p className="portal-sub-text">
            The election administrators have not yet released the results for the <strong>{academicYear} {electionTitle || 'School Election'}</strong>. 
          </p>
          <div className="waiting-notice">
            <div className="notice-dot"></div>
            <span>Waiting for administrators to release final tally</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-container live-results-mode">
      <div className="portal-bg-glows">
        <div className="bg-glow blue"></div>
        <div className="bg-glow purple"></div>
      </div>

      {/* Header */}
      <header className="portal-header">
        <div className="header-left">
          <div className="live-status-indicator">
            <span className="live-pulse"></span>
            <span className="live-text">Live Tally Feed</span>
          </div>
          <h1 className="portal-title">{electionTitle || 'School Election'}</h1>
          <p className="portal-subtitle-meta">
            Academic Year {academicYear} • Official Real-time Results
          </p>
        </div>
        
        {/* Quick stats in header */}
        <div className="header-stats-group">
          <div className="portal-stat-card">
            <div className="stat-card-icon-wrapper blue">
              <Users size={16} />
            </div>
            <div className="stat-card-details">
              <span className="stat-card-label">Turnout Rate</span>
              <div className="stat-card-value-row">
                <span className="stat-card-value">{turnout}%</span>
                <span className="stat-card-badge positive">
                  <TrendingUp size={10} /> Live
                </span>
              </div>
            </div>
          </div>

          <div className="portal-stat-card">
            <div className="stat-card-icon-wrapper green">
              <CheckCircle2 size={16} />
            </div>
            <div className="stat-card-details">
              <span className="stat-card-label">Total Votes Cast</span>
              <span className="stat-card-value">{totalVotes.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="portal-content">
        <div className="results-grid">
          {positions.map(position => {
            const posCandidates = candidates.filter(c => c.position === position.title).sort((a, b) => b.votes - a.votes);
            const totalPositionVotes = posCandidates.reduce((sum, c) => sum + c.votes, 0);

            return (
              <div key={position.id} className="position-result-panel">
                {/* Position Title Bar */}
                <div className="position-panel-header">
                  <div>
                    <h3 className="position-panel-title">{position.title}</h3>
                    <span className="position-subtitle-meta">Voter choice standings</span>
                  </div>
                  <div className="position-votes-badge">
                    <strong>{totalPositionVotes.toLocaleString()}</strong> votes cast
                  </div>
                </div>

                {/* Candidates Standings List */}
                <div className="portal-candidates-list">
                  {posCandidates.map((candidate, idx) => {
                    const percentage = totalPositionVotes > 0 ? ((candidate.votes / totalPositionVotes) * 100).toFixed(1) : 0;
                    const isWinner = idx === 0 && candidate.votes > 0 && posCandidates.length > 1 && candidate.votes > posCandidates[1].votes;

                    return (
                      <div key={candidate.id} className={`portal-candidate-row ${isWinner ? 'winner-highlight' : ''}`}>
                        {/* Rank Badge */}
                        <div className={`portal-rank-badge rank-${idx + 1}`}>
                          {idx === 0 ? <Award size={14} className="winner-crown" /> : idx + 1}
                        </div>

                        {/* Candidate Visual Avatar */}
                        <div className="portal-candidate-avatar-wrapper" style={{ border: `1.5px solid ${candidate.color}25`, overflow: 'hidden' }}>
                          {candidate.photoUrl || candidate.photo ? (
                            <img src={candidate.photoUrl || candidate.photo} alt={candidate.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                          ) : (
                            <div className="portal-candidate-avatar" style={{ background: `${candidate.color}0a`, color: candidate.color, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                              {candidate.avatar}
                            </div>
                          )}
                        </div>

                        {/* Name and Tally Info */}
                        <div className="portal-candidate-standing-details">
                          <div className="portal-candidate-header-row">
                            <span className="portal-candidate-name">
                              {candidate.name}
                              {isWinner && (
                                <span className="winner-label-badge">
                                  Leading
                                </span>
                              )}
                            </span>
                            <div className="portal-candidate-numbers">
                              <span className="vote-number">{candidate.votes.toLocaleString()}</span>
                              <span className="vote-separator">•</span>
                              <span className="vote-percent">{percentage}%</span>
                            </div>
                          </div>

                          {/* Progress Track */}
                          <div className="portal-progress-track">
                            <div 
                              className="portal-progress-fill" 
                              style={{ 
                                width: `${percentage}%`, 
                                background: `linear-gradient(90deg, ${candidate.color}bf, ${candidate.color})`,
                                boxShadow: `0 2px 6px ${candidate.color}25`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {posCandidates.length === 0 && (
                    <div className="portal-empty-standings">
                      <Activity size={24} className="empty-icon" />
                      <p>No candidate entries matching this category.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Secure footer footer */}
      <footer className="portal-secure-footer">
        <div className="secure-badge">
          <Shield size={14} />
          <span>Secured by SchoolElection cryptographic ledger protocols. Verified end-to-end.</span>
        </div>
      </footer>
    </div>
  );
}
