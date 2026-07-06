import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Card } from '@/components/common/Card';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, ShieldCheck, Shield } from 'lucide-react';
import { useElection } from '@/context/ElectionContext';

export default function ManageModerators() {
  const { moderators, addModerator, updateModerator, deleteModerator } = useElection();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMod, setCurrentMod] = useState({ id: null, name: '', email: '', role: 'Station Monitor', photoUrl: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  
  const fileInputRef = useRef(null);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentMod({ id: null, name: '', email: '', role: 'Station Monitor', photoUrl: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (mod) => {
    setIsEditing(true);
    setCurrentMod(mod);
    setIsModalOpen(true);
  };

  const handleSaveMod = (e) => {
    e.preventDefault();
    if (!currentMod.name || !currentMod.email) return;

    if (isEditing) {
      updateModerator(currentMod.id, currentMod);
    } else {
      addModerator(currentMod);
    }
    
    setIsModalOpen(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentMod({ ...currentMod, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header authentic-header">
        <div>
          <div className="header-title-row">
            <h1>Manage Moderators</h1>
          </div>
          <p className="header-subtitle">Add, edit, or remove election moderators and staff.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} style={{ background: 'var(--text-primary)', color: 'var(--bg-color)' }}>
          <Plus size={18} />
          Add Moderator
        </button>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <Card className="stat-card authentic-card">
          <div className="stat-content">
            <div className="stat-header">
              <h3 className="stat-title">Total Staff</h3>
              <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}>
                <Shield size={22} />
              </div>
            </div>
            <div className="stat-value">{moderators.length}</div>
          </div>
        </Card>
      </div>

      <div className="candidate-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {moderators.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>No moderators found. Click "Add Moderator" to get started.</p>
          </div>
        ) : moderators.map(m => (
          <Card key={m.id} className="authentic-card hover-lift" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
            
            <div style={{ height: '100px', background: `linear-gradient(135deg, ${m.color || 'var(--accent-purple)'}40, transparent)`, position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '-30px', left: '1.5rem', width: '70px', height: '70px', borderRadius: '50%', background: m.photoUrl ? 'transparent' : 'var(--bg-color)', border: '4px solid var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                {m.photoUrl ? (
                  <img src={m.photoUrl} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: m.color || 'var(--text-primary)' }}>{m.avatar || m.name.charAt(0)}</span>
                )}
              </div>
            </div>

            <div style={{ padding: '2.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{m.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{m.email}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={14} style={{ color: m.color || 'var(--accent-purple)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{m.role}</span>
              </div>
              
              <div className="flex-between mt-auto pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <button className="btn btn-secondary text-sm flex items-center gap-2" style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.4rem 0.75rem' }} onClick={() => openEditModal(m)}>
                  <Edit2 size={14} /> Edit
                </button>
                <button className="btn text-sm flex items-center gap-2" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '0.4rem 0.75rem' }} onClick={() => setConfirmDeleteId(m.id)}>
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card className="authentic-card" style={{ width: '480px', padding: '2rem', animation: 'fadeIn 0.2s ease-out' }}>
            <div className="flex-between mb-6">
              <h3 className="card-title" style={{ marginBottom: 0 }}>{isEditing ? 'Edit Moderator' : 'Add Moderator'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveMod}>
              {/* Photo Upload Section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-hover)', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {currentMod.photoUrl ? (
                    <img src={currentMod.photoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={24} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                  )}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Profile Photo</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Upload a square image, max 2MB.</p>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  <button type="button" className="btn btn-secondary text-sm" style={{ padding: '0.4rem 0.75rem' }} onClick={() => fileInputRef.current?.click()}>
                    Choose Image
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Mrs. Davis"
                  value={currentMod.name}
                  onChange={e => setCurrentMod({...currentMod, name: e.target.value})}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="e.g. staff@school.edu"
                  value={currentMod.email}
                  onChange={e => setCurrentMod({...currentMod, email: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Staff Role</label>
                <select 
                  className="form-control"
                  value={currentMod.role}
                  onChange={e => setCurrentMod({...currentMod, role: e.target.value})}
                  required
                >
                  <option value="Station Monitor">Station Monitor</option>
                  <option value="Chief Moderator">Chief Moderator</option>
                  <option value="IT Support">IT Support</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={!currentMod.name || !currentMod.email}>
                  {isEditing ? 'Save Changes' : 'Add Moderator'}
                </button>
              </div>
            </form>
          </Card>
        </div>,
        document.body
      )}

      {confirmDeleteId && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card className="authentic-card" style={{ width: '380px', padding: '2rem', animation: 'fadeIn 0.2s ease-out' }}>
            <h3 className="card-title mb-2" style={{ color: 'var(--danger)' }}>Remove Moderator</h3>
            <p className="text-secondary mb-6 text-sm">Are you sure you want to remove this moderator? Their access will be revoked immediately.</p>
            <div className="flex gap-3 justify-end">
              <button className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="btn" style={{ background: 'var(--danger)', color: 'white' }} onClick={() => { deleteModerator(confirmDeleteId); setConfirmDeleteId(null); }}>Yes, Remove</button>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}
