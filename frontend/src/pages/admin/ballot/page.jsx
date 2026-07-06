import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Card } from '@/components/common/Card';
import { Plus, Edit2, Trash2, ListChecks, CheckCircle2, X, Briefcase, Users, Hash, ChevronRight } from 'lucide-react';
import { useElection } from '@/context/ElectionContext';

export default function ManageBallot() {
  const { positions, addPosition, updatePosition, deletePosition, candidates } = useElection();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', maxVotes: 1 });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleOpenModal = (position = null) => {
    if (position) {
      setEditingId(position.id);
      setFormData({ title: position.title, maxVotes: position.maxVotes });
    } else {
      setEditingId(null);
      setFormData({ title: '', maxVotes: 1 });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    if (editingId) {
      updatePosition(editingId, formData.title, formData.maxVotes);
    } else {
      addPosition(formData.title, formData.maxVotes);
    }
    setIsModalOpen(false);
  };

  const cardColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

  return (
    <div className="animate-fade-in">
      <div className="page-header authentic-header">
        <div>
          <div className="header-title-row">
            <h1>Ballot & Positions</h1>
          </div>
          <p className="header-subtitle">Design the exact structure of your election ballot and enforce voting rules.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ background: 'var(--text-primary)', color: 'var(--bg-color)', padding: '0.75rem 1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Plus size={18} />
          Create Position
        </button>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        <Card className="stat-card authentic-card" style={{ background: 'linear-gradient(135deg, var(--surface-color), var(--bg-color))' }}>
          <div className="stat-content">
            <div className="stat-header">
              <h3 className="stat-title">Configured Positions</h3>
              <div className="stat-icon-wrapper" style={{ background: 'var(--text-primary)', color: 'var(--bg-color)' }}>
                <ListChecks size={22} />
              </div>
            </div>
            <div className="stat-value">{positions.length}</div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Briefcase size={20} style={{ color: 'var(--text-secondary)' }} />
        <h3 className="section-title" style={{ margin: 0 }}>Active Ballot Structure</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {positions.map((p, index) => {
          const assignedCount = candidates.filter(c => c.position === p.title).length;
          const accentColor = cardColors[index % cardColors.length];
          
          return (
            <div key={p.id} className="authentic-card hover-lift" style={{ 
              display: 'flex', alignItems: 'stretch', padding: 0, overflow: 'hidden', 
              background: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--border-color)',
              boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)', transition: 'all 0.3s ease'
            }}>
              
              {/* Color Bar */}
              <div style={{ width: '8px', background: accentColor, flexShrink: 0 }} />

              {/* Main Content */}
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', alignItems: 'center', gap: '2rem' }}>
                
                {/* Number/Order Indicator */}
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${accentColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontWeight: 800, fontSize: '1.25rem', flexShrink: 0 }}>
                  {index + 1}
                </div>

                {/* Title & Info */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
                    {p.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
                      <Users size={14} style={{ color: accentColor }} />
                      <span>{assignedCount} Candidate{assignedCount !== 1 ? 's' : ''} Enrolled</span>
                    </div>
                  </div>
                </div>

                {/* Voting Rule Pill */}
                <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '180px' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <Hash size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 700 }}>Voting Rule</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Select up to <span style={{ color: accentColor, fontSize: '1.1rem', fontWeight: 800 }}>{p.maxVotes}</span></div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => handleOpenModal(p)}
                    style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', background: 'var(--surface-hover)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--bg-color)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    title="Edit Position"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(p.id)}
                    style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = 'var(--danger)'; }}
                    title="Remove Position"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            </div>
          );
        })}

        {positions.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--surface-color)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
            <ListChecks size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No positions defined yet.</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Click "Create Position" to get started building your ballot.</p>
          </div>
        )}
      </div>

      {isModalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="authentic-card" style={{ width: '440px', padding: '2.5rem', animation: 'fadeIn 0.2s ease-out', background: 'var(--surface-color)', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="flex-between mb-6">
              <h3 className="card-title" style={{ marginBottom: 0, fontSize: '1.5rem', fontWeight: 800 }}>{editingId ? 'Edit Position' : 'Create Position'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--surface-hover)', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>
            
            <div className="form-group mb-5">
              <label style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>Position Title</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. President"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                style={{ padding: '0.75rem 1rem', fontSize: '1rem', borderRadius: '12px' }}
              />
            </div>
            
            <div className="form-group mb-8">
              <label style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>Maximum Allowed Votes</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="number" 
                  min="1"
                  className="form-control" 
                  value={formData.maxVotes}
                  onChange={(e) => setFormData({...formData, maxVotes: e.target.value})}
                  style={{ width: '100px', padding: '0.75rem', fontSize: '1.1rem', fontWeight: 700, borderRadius: '12px', textAlign: 'center' }}
                />
                <p className="text-sm text-secondary" style={{ flex: 1, lineHeight: 1.4 }}>
                  How many candidates a single voter can choose for this position.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, background: 'var(--text-primary)', color: 'var(--bg-color)' }} onClick={handleSave}>
                {editingId ? 'Save Changes' : 'Create Position'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {confirmDeleteId && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="authentic-card" style={{ width: '400px', padding: '2.5rem', animation: 'fadeIn 0.2s ease-out', background: 'var(--surface-color)', borderRadius: '24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Trash2 size={32} />
            </div>
            <h3 className="card-title mb-3" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Remove Position?</h3>
            <p className="text-secondary mb-8 text-sm" style={{ lineHeight: 1.6 }}>
              Are you sure you want to remove this position? This will also unassign all candidates currently linked to this role. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, flex: 1 }} onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="btn" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, background: 'var(--danger)', color: 'white', flex: 1 }} onClick={() => { deletePosition(confirmDeleteId); setConfirmDeleteId(null); }}>Yes, Remove</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
