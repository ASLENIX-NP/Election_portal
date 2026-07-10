import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { MonitorPlay, Plus, Trash2, ShieldCheck, Search, Info } from 'lucide-react';
import { useKioskContext } from '@/context/KioskContext';

export default function ManageBooths() {
  const { booths, addBooth, removeBooth } = useKioskContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBooth, setNewBooth] = useState({ name: '', location: '' });

  const filteredBooths = booths.filter(booth => 
    booth.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booth.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBooth = (e) => {
    e.preventDefault();
    if (!newBooth.name.trim()) return;
    
    addBooth({
      name: newBooth.name,
      location: newBooth.location || 'Unspecified Location',
    });
    
    setNewBooth({ name: '', location: '' });
    setShowAddForm(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      
      {/* Premium Header */}
      <div className="page-header authentic-header" style={{ marginBottom: '2.5rem' }}>
        <div>
          <div className="header-title-row">
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
              <div style={{ padding: '12px', background: 'var(--text-primary)', color: 'var(--bg-color)', borderRadius: '16px', display: 'flex', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                <MonitorPlay size={28} />
              </div>
              Voting Booths
            </h1>
          </div>
          <p className="header-subtitle" style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem' }}>
            <ShieldCheck size={18} style={{ color: 'var(--accent)' }} /> Register and monitor physical voting terminals across campus.
          </p>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}
        >
          <Plus size={20} /> Register New Booth
        </button>
      </div>

      {/* Add Booth Modal */}
      {showAddForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
          <Card style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', position: 'relative', borderRadius: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            
            {/* Ambient glow inside the modal */}
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', filter: 'blur(20px)', zIndex: 0 }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', color: '#3b82f6' }}>
                  <MonitorPlay size={22} />
                </div>
                Register Booth
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>Set up a new physical terminal for the election.</p>
            
            <form onSubmit={handleAddBooth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Terminal Name / Number <span style={{color: 'var(--danger)'}}>*</span></label>
                <input 
                  type="text" 
                  value={newBooth.name}
                  onChange={(e) => setNewBooth({...newBooth, name: e.target.value})}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  placeholder="e.g. Booth 01, Lab Terminal A..."
                  autoFocus
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Location (Optional)</label>
                <input 
                  type="text" 
                  value={newBooth.location}
                  onChange={(e) => setNewBooth({...newBooth, location: e.target.value})}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  placeholder="e.g. Library 2nd Floor, Room 101..."
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Register Terminal</button>
              </div>
            </form>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Analytics & Search Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <MonitorPlay size={24} color="#3b82f6" />
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Registered</p>
              <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '2rem', fontWeight: 800 }}>{booths.length}</h3>
            </div>
          </Card>
          
          <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div className="pulse-dot" style={{ width: 16, height: 16, background: '#10b981', boxShadow: '0 0 12px #10b981' }}></div>
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active / Idle</p>
              <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '2rem', fontWeight: 800 }}>{booths.filter(b => b.status === 'idle').length}</h3>
            </div>
          </Card>
          
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search by booth name or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'var(--surface-color)', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--text-primary)',
                  padding: '16px 16px 16px 48px',
                  borderRadius: '16px',
                  outline: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--text-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
              />
            </div>
          </div>
        </div>

        {/* Booths Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          
          {filteredBooths.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-secondary)', background: 'var(--surface-color)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
              <MonitorPlay size={48} style={{ opacity: 0.2, margin: '0 auto 1.5rem', display: 'block' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Booths Found</h3>
              <p style={{ fontSize: '1.1rem' }}>Register a new booth to start configuring your polling stations.</p>
            </div>
          ) : (
            filteredBooths.map(booth => (
              <Card key={booth.id} className="hover-lift" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRadius: '20px', border: booth.status === 'offline' ? '1px solid var(--border-color)' : '1px solid rgba(16, 185, 129, 0.3)', background: booth.status === 'offline' ? 'var(--surface-color)' : 'linear-gradient(145deg, rgba(16, 185, 129, 0.05), var(--surface-color))' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '12px', borderRadius: '14px', background: booth.status === 'offline' ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.15)', color: booth.status === 'offline' ? 'var(--text-secondary)' : '#10b981' }}>
                      <MonitorPlay size={28} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{booth.name}</h3>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontWeight: 600 }}>{booth.id}</p>
                    </div>
                  </div>
                  
                  {booth.status === 'offline' ? (
                     <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', letterSpacing: '0.05em' }}>
                       <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)' }}></div> OFFLINE
                     </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '6px 12px', borderRadius: '20px', letterSpacing: '0.05em' }}>
                      <div className="pulse-dot" style={{ width: 6, height: 6, background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div> IDLE / READY
                    </span>
                  )}
                </div>
                
                <div style={{ background: 'var(--bg-color)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                   <Info size={18} color="var(--text-secondary)" style={{ marginTop: '2px' }} />
                   <div>
                     <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</p>
                     <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>{booth.location}</p>
                   </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => removeBooth(booth.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Trash2 size={18} /> Remove Booth
                  </button>
                </div>
                
              </Card>
            ))
          )}
          
        </div>
      </div>
    </div>
  );
}
