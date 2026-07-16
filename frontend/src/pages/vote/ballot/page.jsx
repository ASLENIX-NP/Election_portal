import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import CandidateModal from '@/components/vote/CandidateModal';
import { CheckCircle2, Info, Lock, X, AlertTriangle } from 'lucide-react';
import { useBallotContext } from '@/context/BallotContext';
import { useKioskContext } from '@/context/KioskContext';
import { useElection } from '@/context/ElectionContext';

export default function BallotPage() {
  const navigate = useNavigate();
  const { boothId } = useParams();
  const { setReceipt } = useBallotContext();
  const { markVoted, activeStudent } = useKioskContext();
  const { positions, candidates, castBallot } = useElection();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votes, setVotes] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Generate dynamic ballot data from ElectionContext
  const ballotData = positions.map(pos => ({
    id: pos.id,
    title: pos.title,
    maxVotes: pos.maxVotes,
    candidates: candidates.filter(c => c.position === pos.title)
  }));

  const handleToggleVote = (positionId, candidateId, maxVotes) => {
    setVotes(prev => {
      const posVotes = prev[positionId] || [];
      if (posVotes.includes(candidateId)) {
        return { ...prev, [positionId]: posVotes.filter(id => id !== candidateId) };
      } else {
        if (posVotes.length < maxVotes) {
          return { ...prev, [positionId]: [...posVotes, candidateId] };
        }
        return prev;
      }
    });
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmAndSubmit = async () => {
    // Gather all selected candidate IDs across all positions
    const selectedCandidateIds = Object.values(votes).flat();
    
    // Cast the vote securely into the global ledger (ElectionContext)
    const success = await castBallot(selectedCandidateIds, activeStudent);

    if (success) {
      // Generate Cryptographic Receipt Hash
      const randomHash = '#' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      setReceipt(randomHash);
      
      // Finalize the Kiosk Session with booth context
      markVoted(boothId);
      setShowConfirmModal(false);
      navigate(`/vote/${boothId}/receipt`);
    } else {
      alert("Failed to cast vote. You may have already voted.");
      setShowConfirmModal(false);
    }
  };

  const totalPositions = ballotData.length;
  const completedPositions = ballotData.filter(pos => (votes[pos.id] || []).length === pos.maxVotes).length;
  const progressPercent = totalPositions === 0 ? 0 : (completedPositions / totalPositions) * 100;
  const isComplete = completedPositions === totalPositions && totalPositions > 0;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '8rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        
        {/* Progress Tracker */}
        <div style={{ position: 'sticky', top: '1rem', zIndex: 50, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Voting Progress</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isComplete ? '#10b981' : '#3b82f6' }}>{completedPositions} of {totalPositions} Categories</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: isComplete ? '#10b981' : '#3b82f6', width: `${progressPercent}%`, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
            </div>
          </div>
          {isComplete && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '0.9rem', animation: 'fadeUp 0.3s ease-out' }}>
              <CheckCircle2 size={20} /> Complete
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '4rem', animation: 'slideDown 0.6s ease-out' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '1rem' }}>
            Official Ballot
          </h1>
          <p style={{ color: '#475569', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Please select your preferred candidates for each position below. Your selections are securely encrypted and strictly anonymous.
          </p>
        </div>

        <form onSubmit={handlePreSubmit} style={{ position: 'relative', zIndex: 1 }}>
          {ballotData.map((position) => {
            const selectedCount = (votes[position.id] || []).length;
            const isSatisfied = selectedCount === position.maxVotes;

            return (
              <div key={position.id} style={{ marginBottom: '5rem', animation: 'fadeUp 0.6s ease-out backwards' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                  <h2 style={{ fontSize: '2.rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>{position.title}</h2>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>Select {position.maxVotes > 1 ? `up to ${position.maxVotes}` : '1'} candidate{position.maxVotes > 1 ? 's' : ''}</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
                  {position.candidates.map(candidate => {
                    const isSelected = (votes[position.id] || []).includes(candidate.id);
                    const isMaxed = selectedCount >= position.maxVotes && !isSelected;
                    
                    return (
                      <div 
                        key={candidate.id} 
                        style={{ 
                          cursor: isMaxed ? 'not-allowed' : 'pointer', 
                          position: 'relative',
                          padding: '2rem 1.5rem',
                          borderRadius: '24px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          border: isSelected ? '2px solid #10b981' : '1px solid #e2e8f0',
                          background: isSelected ? '#f0fdf4' : '#ffffff',
                          boxShadow: isSelected ? '0 10px 25px -5px rgba(16, 185, 129, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                          opacity: isMaxed ? 0.6 : 1,
                          transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseOver={(e) => { 
                          if(!isMaxed && !isSelected) { 
                            e.currentTarget.style.transform = 'translateY(-4px)'; 
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; 
                          } 
                        }}
                        onMouseOut={(e) => { 
                          if(!isMaxed && !isSelected) { 
                            e.currentTarget.style.transform = 'translateY(0)'; 
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'; 
                          } 
                        }}
                        onClick={() => !isMaxed && handleToggleVote(position.id, candidate.id, position.maxVotes)}
                      >
                        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSelectedCandidate(candidate); }}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#334155'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                            title="View Profile"
                          >
                            <Info size={16} />
                          </button>
                        </div>

                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random&color=fff&size=120`} 
                          alt={candidate.name}
                          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: isSelected ? '4px solid #10b981' : '1px solid #e2e8f0', marginBottom: '1.25rem', transition: 'all 0.2s ease', boxShadow: isSelected ? '0 0 0 4px rgba(16, 185, 129, 0.2)' : 'none' }}
                        />
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 4px 0', color: '#0f172a' }}>{candidate.name}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{position.title} Candidate</p>
                        
                        <div style={{ marginTop: 'auto', width: '100%' }}>
                          <div style={{ 
                            width: '100%', padding: '10px 0', borderRadius: '12px',
                            background: isSelected ? '#10b981' : '#f8fafc',
                            border: isSelected ? 'none' : '1px solid #e2e8f0',
                            color: isSelected ? '#ffffff' : '#475569',
                            fontWeight: 700, fontSize: '0.95rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: 'all 0.2s ease'
                          }}>
                            {isSelected ? <><CheckCircle2 size={18} /> Selected</> : 'Select'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          {/* Floating Pill Action Footer */}
          <div style={{ 
            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100,
            animation: 'slideUp 0.6s ease-out 0.5s backwards'
          }}>
            <div style={{ 
              padding: '8px 8px 8px 24px', 
              background: '#ffffff', 
              border: '1px solid #e2e8f0',
              borderRadius: '999px',
              display: 'flex', alignItems: 'center', gap: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: isComplete ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center' }}>
                  <Lock size={20} />
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: '#0f172a', display: 'block', fontSize: '1rem', lineHeight: 1.2 }}>
                    {isComplete ? 'Ready to Submit' : 'Incomplete Ballot'}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                    {isComplete ? 'All categories filled' : `${totalPositions - completedPositions} categor${totalPositions - completedPositions === 1 ? 'y' : 'ies'} remaining`}
                  </span>
                </div>
              </div>
              <button 
                type="submit" 
                style={{ 
                  padding: '12px 28px', fontSize: '1rem', fontWeight: 700, borderRadius: '999px',
                  background: isComplete ? '#10b981' : '#e2e8f0',
                  color: isComplete ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  boxShadow: isComplete ? '0 4px 14px 0 rgba(16, 185, 129, 0.39)' : 'none',
                  transition: 'all 0.2s ease',
                  cursor: isComplete ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
                disabled={!isComplete}
              >
                Cast Ballot {isComplete && <CheckCircle2 size={18} />}
              </button>
            </div>
          </div>
        </form>

        <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />

        {/* Crisp Review Modal */}
        {showConfirmModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
            <div style={{ background: '#ffffff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '700px', padding: '2.5rem', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)', animation: 'slideUp 0.3s ease-out', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Review Your Ballot</h2>
                  <p style={{ color: '#64748b', margin: 0 }}>Please verify your selections before casting.</p>
                </div>
                <button type="button" onClick={() => setShowConfirmModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}>
                  <X size={20} />
                </button>
              </div>
              
              <div style={{ overflowY: 'auto', paddingRight: '8px', marginBottom: '2.5rem', flex: 1 }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {ballotData.map(pos => (
                    <div key={pos.id} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, color: '#475569', fontSize: '1rem', fontWeight: 600 }}>{pos.title}</h4>
                      {votes[pos.id]?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          {votes[pos.id].map(candId => {
                            const cand = pos.candidates.find(c => c.id === candId);
                            return cand ? (
                              <div key={candId} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '6px 12px', borderRadius: '999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <CheckCircle2 size={16} color="#10b981" />
                                <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.9rem' }}>{cand.name}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      ) : (
                         <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.9rem', background: '#fef2f2', padding: '6px 12px', borderRadius: '999px', border: '1px solid #fecaca' }}>Omitted</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button 
                  type="button" 
                  onClick={() => setShowConfirmModal(false)}
                  style={{ flex: 1, padding: '16px', background: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '16px', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                >
                  Go Back
                </button>
                <button 
                  type="button" 
                  onClick={confirmAndSubmit}
                  style={{ flex: 2, padding: '16px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '16px', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Lock size={18} /> Confirm & Cast Ballot
                </button>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
