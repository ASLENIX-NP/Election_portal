import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import CandidateModal from '../../../components/vote/CandidateModal';
import { CheckCircle2, Info } from 'lucide-react';
import { useBallotContext } from '../../../context/BallotContext';
import { useKioskContext } from '../../../context/KioskContext';

export default function BallotPage() {
  const navigate = useNavigate();
  const { setReceipt } = useBallotContext();
  const { markVoted } = useKioskContext();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votes, setVotes] = useState({});

  // Mock Election Data
  const ballotData = [
    {
      id: 'pos1',
      title: 'President',
      maxVotes: 1,
      candidates: [
        { id: 'c1', name: 'John Doe', position: 'President', slogan: 'A better tomorrow, today.', platform: ['More student parking', 'Healthier cafeteria options', 'Friday pep rallies'] },
        { id: 'c2', name: 'Jane Smith', position: 'President', slogan: 'Action over words.', platform: ['Tech upgrades for library', 'Extend lunch by 10 mins', 'Weekly mental health days'] }
      ]
    },
    {
      id: 'pos2',
      title: 'Vice President',
      maxVotes: 1,
      candidates: [
        { id: 'c3', name: 'Alice Williams', position: 'Vice President', slogan: 'Voice of the students.', platform: ['Revamp student council', 'More extracurricular funding'] },
        { id: 'c4', name: 'Bob M.', position: 'Vice President', slogan: 'Keep it simple.', platform: ['Better wifi', 'Open campus for seniors'] }
      ]
    }
  ];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate Cryptographic Receipt Hash
    const randomHash = '#' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    setReceipt(randomHash);
    
    // Finalize the Kiosk Session
    markVoted();
    
    navigate('/vote/receipt');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'slideDown 0.6s ease-out' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', background: 'linear-gradient(135deg, #fff 0%, #6ee7b7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Official Ballot
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review the candidates and cast your vote carefully.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {ballotData.map((position) => (
          <div key={position.id} style={{ marginBottom: '3rem', animation: 'fadeUp 0.6s ease-out backwards' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{position.title}</h2>
              <span className="badge active">Select up to {position.maxVotes}</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {position.candidates.map(candidate => {
                const isSelected = (votes[position.id] || []).includes(candidate.id);
                return (
                  <Card 
                    key={candidate.id} 
                    style={{ 
                      cursor: 'pointer', 
                      position: 'relative',
                      border: isSelected ? '2px solid var(--success)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(16,185,129,0.05)' : 'var(--surface-color)',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleToggleVote(position.id, candidate.id, position.maxVotes)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '4px' }}>{candidate.name}</h3>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedCandidate(candidate); }}
                          style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}
                        >
                          <Info size={16} /> View Profile
                        </button>
                      </div>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', border: isSelected ? 'none' : '2px solid var(--border-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981'
                      }}>
                        {isSelected && <CheckCircle2 size={32} style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' }} />}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
        
        <div style={{ position: 'sticky', bottom: '2rem', zIndex: 10 }}>
          <Card style={{ padding: '1.5rem', background: 'rgba(6,9,19,0.9)', backdropFilter: 'blur(20px)', border: '1px solid var(--accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Ready to submit?</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You cannot change your vote after submission.</p>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
              Cast Ballot securely
            </button>
          </Card>
        </div>
      </form>

      <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
    </div>
  );
}
