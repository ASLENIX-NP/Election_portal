import React, { useState } from 'react';
import { RefreshCcw, Search, CheckCircle, ShieldAlert, FileKey } from 'lucide-react';
import { useKioskContext } from '@/context/KioskContext';

export default function ModResetPage() {
  const { roster, logAction, isLockdown, enableVoting, booths } = useKioskContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const [generatedPass, setGeneratedPass] = useState('');
  const [selectedBooth, setSelectedBooth] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    setSearchResult(null);
    setGeneratedPass('');
    
    if (isLockdown) {
      setError('System is currently in Emergency Lockdown. Resets are disabled.');
      return;
    }

    const query = searchQuery.trim().toUpperCase();
    if (!query) return;

    const student = roster.find(s => s.id === query || s.name.toUpperCase() === query);
    
    if (!student) {
      setError('Student not found in the voter roster.');
    } else {
      setSearchResult(student);
    }
  };

  const handleIssueOverride = () => {
    if (searchResult.status === 'voted') {
      setError('Student has already voted. Override passes cannot be issued.');
      return;
    }
    if (!selectedBooth) {
      alert("Please select a terminal.");
      return;
    }

    enableVoting(searchResult.id, selectedBooth);
    setGeneratedPass('AUTHORIZED');
    logAction('warning', `Issued Terminal Override for student ${searchResult.name} (${searchResult.id})`, 'Moderator');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem' }}>
      <div className="page-header" style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
        <div className="header-title-row" style={{ marginBottom: '12px' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '2.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex' }}>
              <RefreshCcw size={28} color="var(--accent)" />
            </div>
            Credential Reset
          </h1>
        </div>
        <p className="header-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: 0 }}>
          Securely generate temporary override passes for lost or forgotten credentials.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={20} color="var(--accent)" /> Lookup Voter
          </h2>
          <form onSubmit={handleSearch}>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <Search size={20} className="input-icon left-icon" />
              <input 
                type="text" 
                placeholder="Enter Name or ID (e.g., PASS-1001)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLockdown}
              />
            </div>
            <button type="submit" className="primary-btn" style={{ width: '100%' }} disabled={isLockdown}>
              Search Roster
            </button>
          </form>

          {error && (
            <div style={{ margin: '1.5rem 0 0 0', padding: '1rem', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <ShieldAlert size={20} /> <span>{error}</span>
            </div>
          )}
        </div>

        {searchResult && (
          <div className="glass-panel" style={{ padding: '2rem', animation: 'fadeUp 0.3s ease-out' }}>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 1.5rem 0', color: 'var(--text-primary)' }}>Voter Identity</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Name</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{searchResult.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>ID</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{searchResult.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Grade</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{searchResult.grade}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                {searchResult.status === 'voted' ? (
                  <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Already Voted</span>
                ) : (
                  <span style={{ color: 'var(--success)', fontWeight: '600' }}>Eligible</span>
                )}
              </div>
            </div>

            {!generatedPass ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  value={selectedBooth} 
                  onChange={(e) => setSelectedBooth(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', background: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem', flex: 1 }}
                >
                  <option value="">Select Terminal...</option>
                  {booths && booths.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.location})</option>
                  ))}
                </select>
                <button 
                  onClick={handleIssueOverride} 
                  className="btn" 
                  style={{ flex: 2, background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', borderColor: 'rgba(245,158,11,0.3)', padding: '12px' }}
                  disabled={searchResult.status === 'voted' || !selectedBooth}
                >
                  <FileKey size={20} /> Authorize Terminal Override
                </button>
              </div>
            ) : (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <CheckCircle size={32} color="var(--success)" style={{ margin: '0 auto 10px auto' }} />
                <h3 style={{ color: 'var(--success)', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Override Authorized</h3>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '2px', color: '#fff', userSelect: 'all' }}>
                  ACCESS GRANTED
                </div>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>The voter may now proceed to the terminal.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
