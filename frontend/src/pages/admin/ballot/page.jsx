import { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Card } from '@/components/common/Card';
import { Plus, Edit2, Trash2, ListChecks, CheckCircle2, X, Briefcase, Users, Hash, ChevronRight, Image as ImageIcon, Search, ChevronLeft, CheckSquare, Square, UserPlus } from 'lucide-react';
import { useElection } from '@/context/ElectionContext';
import '../dashboard.css';
import './ballot.css';

export default function ManageBallot() {
  const { 
    positions, addPosition, updatePosition, deletePosition, 
    candidates, addCandidate, updateCandidate, deleteCandidate,
    advancedSettings 
  } = useElection();
  
  const [activeTab, setActiveTab] = useState('positions'); // 'positions' or 'candidates'
  
  // ─── Ballot Positions State ───
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [editingPositionId, setEditingPositionId] = useState(null);
  const [positionFormData, setPositionFormData] = useState({ title: '', maxVotes: 1 });
  const [confirmDeletePositionId, setConfirmDeletePositionId] = useState(null);

  // ─── Candidates State ───
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isEditingCandidate, setIsEditingCandidate] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState({ id: null, name: '', position: '', grade: '', photoUrl: '' });
  const [confirmDeleteCandidateId, setConfirmDeleteCandidateId] = useState(null);
  
  const availableGrades = advancedSettings?.availableGrades || ['9th', '10th', '11th', '12th'];
  
  // Candidates Table State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());
  const itemsPerPage = 10;
  
  const fileInputRef = useRef(null);

  // ─── Ballot Positions Handlers ───
  const handleOpenPositionModal = (position = null) => {
    if (position) {
      setEditingPositionId(position.id);
      setPositionFormData({ title: position.title, maxVotes: position.maxVotes });
    } else {
      setEditingPositionId(null);
      setPositionFormData({ title: '', maxVotes: 1 });
    }
    setIsPositionModalOpen(true);
  };

  const handleSavePosition = () => {
    if (!positionFormData.title.trim()) return;
    if (editingPositionId) {
      updatePosition(editingPositionId, positionFormData.title, positionFormData.maxVotes);
    } else {
      addPosition(positionFormData.title, positionFormData.maxVotes);
    }
    setIsPositionModalOpen(false);
  };

  // ─── Candidates Handlers ───
  const openAddCandidateModal = () => {
    setIsEditingCandidate(false);
    setCurrentCandidate({ 
      id: null, 
      name: '', 
      position: positions[0]?.title || '', 
      grade: availableGrades[0] || '10th', 
      photoUrl: '' 
    });
    setIsCandidateModalOpen(true);
  };

  const openEditCandidateModal = (candidate) => {
    setIsEditingCandidate(true);
    setCurrentCandidate(candidate);
    setIsCandidateModalOpen(true);
  };

  const handleSaveCandidate = (e) => {
    e.preventDefault();
    if (!currentCandidate.name || !currentCandidate.position) return;

    if (isEditingCandidate) {
      updateCandidate(currentCandidate.id, currentCandidate);
    } else {
      addCandidate(currentCandidate);
    }
    
    setIsCandidateModalOpen(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentCandidate({ ...currentCandidate, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkDeleteCandidates = () => {
    if (selectedCandidates.size === 0) return;
    if (window.confirm(`Are you sure you want to remove ${selectedCandidates.size} candidates?`)) {
      selectedCandidates.forEach(id => deleteCandidate(id));
      setSelectedCandidates(new Set());
    }
  };

  const toggleSelectAllCandidates = () => {
    if (selectedCandidates.size === currentCandidateItems.length && currentCandidateItems.length > 0) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(currentCandidateItems.map(c => c.id)));
    }
  };

  const toggleSelectCandidate = (id) => {
    setSelectedCandidates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSortCandidates = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filteredAndSortedCandidates = useMemo(() => {
    let result = candidates;
    
    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(c => 
        (c.name && c.name.toLowerCase().includes(lower)) || 
        (c.position && c.position.toLowerCase().includes(lower)) ||
        (c.grade && c.grade.toLowerCase().includes(lower))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [candidates, searchTerm, sortField, sortDir]);

  const totalCandidatePages = Math.ceil(filteredAndSortedCandidates.length / itemsPerPage);
  const currentCandidateItems = filteredAndSortedCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return <span style={{ fontSize: '0.65rem', marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  const cardColors = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706', '#0891b2'];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* ─── Page Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#0f172a', margin: '0 0 4px 0' }}>
            Ballot & Candidates
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            Configure ballot structure and manage election candidates
          </p>
        </div>
        <div>
          {activeTab === 'positions' ? (
            <button 
              onClick={() => handleOpenPositionModal()} 
              className="btn btn-primary"
              style={{ padding: '7px 14px', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Plus size={15} />
              Create Position
            </button>
          ) : (
            <button 
              onClick={openAddCandidateModal} 
              className="btn btn-primary"
              style={{ padding: '7px 14px', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}
              disabled={positions.length === 0}
            >
              <UserPlus size={15} />
              Add Candidate
            </button>
          )}
        </div>
      </div>

      {/* ─── Tab Switcher ─── */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('positions')}
          style={{ 
            padding: '8px 16px', background: 'transparent', border: 'none', 
            color: activeTab === 'positions' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'positions' ? '2px solid #2563eb' : '2px solid transparent',
            fontWeight: activeTab === 'positions' ? 600 : 500, fontSize: '0.85rem', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.15s ease'
          }}
        >
          Ballot Structure ({positions.length})
        </button>
        <button 
          onClick={() => setActiveTab('candidates')}
          style={{ 
            padding: '8px 16px', background: 'transparent', border: 'none', 
            color: activeTab === 'candidates' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'candidates' ? '2px solid #2563eb' : '2px solid transparent',
            fontWeight: activeTab === 'candidates' ? 600 : 500, fontSize: '0.85rem', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.15s ease'
          }}
        >
          Candidates ({candidates.length})
        </button>
      </div>

      {/* ─── Tab 1: Positions ─── */}
      {activeTab === 'positions' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem' }}>
            <Briefcase size={16} style={{ color: 'var(--text-secondary)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>Ballot Structure</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {positions.map((p, index) => {
              const assignedCount = candidates.filter(c => c.position === p.title).length;
              const accentColor = cardColors[index % cardColors.length];
              
              return (
                <div key={p.id} className="ballot-position-card">
                  <div className="ballot-color-bar" style={{ background: accentColor }} />
                  <div className="ballot-card-content">
                    <div className="ballot-number-indicator" style={{ background: `${accentColor}0a`, color: accentColor, fontSize: '0.95rem', width: '32px', height: '32px', borderRadius: '8px' }}>
                      {index + 1}
                    </div>

                    <div className="ballot-title-info">
                      <h4 className="ballot-position-title" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {p.title}
                      </h4>
                      <div className="ballot-position-meta">
                        <div className="ballot-enrolled-count" style={{ fontSize: '0.78rem' }}>
                          <Users size={12} style={{ color: accentColor }} />
                          <span>{assignedCount} Candidate{assignedCount !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ballot-voting-rule" style={{ padding: '6px 12px', minWidth: '150px', borderRadius: '8px' }}>
                      <div className="ballot-rule-icon">
                        <Hash size={15} />
                      </div>
                      <div>
                        <div className="ballot-rule-label" style={{ fontSize: '0.6rem' }}>Voting Rule</div>
                        <div className="ballot-rule-value" style={{ fontSize: '0.8rem' }}>Select up to <span className="ballot-rule-highlight" style={{ color: accentColor, fontSize: '0.85rem' }}>{p.maxVotes}</span></div>
                      </div>
                    </div>

                    <div className="ballot-card-actions" style={{ paddingLeft: '0.75rem' }}>
                      <button 
                        onClick={() => handleOpenPositionModal(p)}
                        className="ballot-action-btn edit-btn"
                        style={{ width: '32px', height: '32px', borderRadius: '8px' }}
                        title="Edit Position"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => setConfirmDeletePositionId(p.id)}
                        className="ballot-action-btn delete-btn"
                        style={{ width: '32px', height: '32px', borderRadius: '8px' }}
                        title="Remove Position"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {positions.length === 0 && (
              <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--surface-color)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                <ListChecks size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.2 }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 500, margin: '0 0 4px 0' }}>No positions defined yet.</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>Click "Create Position" to get started building your ballot.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Tab 2: Candidates ─── */}
      {activeTab === 'candidates' && (
        <div className="animate-fade-in dashboard-panel">
          {/* Toolbar */}
          <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              width: '280px', background: '#f5f6f8', borderRadius: '8px', padding: '0 12px',
              border: '1px solid transparent'
            }}>
              <Search size={15} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.825rem', padding: '8px 0', fontFamily: 'inherit' }} 
              />
            </div>

            {selectedCandidates.size > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>{selectedCandidates.size}</strong> selected
                </span>
                <button className="btn btn-danger" onClick={handleBulkDeleteCandidates} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  <Trash2 size={13} /> Bulk Delete
                </button>
              </div>
            )}
          </div>

          {/* Data Table */}
          <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }} onClick={toggleSelectAllCandidates}>
                    {selectedCandidates.size === currentCandidateItems.length && currentCandidateItems.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                  </th>
                  <th>Profile</th>
                  <th onClick={() => handleSortCandidates('name')}>Name <SortIcon field="name" /></th>
                  <th onClick={() => handleSortCandidates('position')}>Position <SortIcon field="position" /></th>
                  <th onClick={() => handleSortCandidates('grade')}>Class <SortIcon field="grade" /></th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCandidateItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No candidates found.</td>
                  </tr>
                ) : currentCandidateItems.map(c => (
                  <tr key={c.id} className={selectedCandidates.has(c.id) ? 'selected' : ''}>
                    <td onClick={() => toggleSelectCandidate(c.id)} style={{ cursor: 'pointer' }}>
                      {selectedCandidates.has(c.id) ? <CheckSquare size={16} color="var(--accent)" /> : <Square size={16} color="var(--text-muted)" />}
                    </td>
                    <td>
                      <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: c.photoUrl ? 'transparent' : '#f5f6f8', border: `1px solid ${c.color || 'var(--border-color)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {c.photoUrl ? (
                          <img src={c.photoUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: c.color || 'var(--text-primary)' }}>{c.avatar || c.name.charAt(0)}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(37, 99, 235, 0.06)', color: 'var(--accent)' }}>{c.position}</span>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>{c.grade}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <button className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--text-primary)' }} onClick={() => openEditCandidateModal(c)} title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--danger)' }} onClick={() => setConfirmDeleteCandidateId(c.id)} title="Remove">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Showing {filteredAndSortedCandidates.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedCandidates.length)} of {filteredAndSortedCandidates.length}
            </span>
            
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                className="btn btn-secondary" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                style={{ padding: '5px 10px', fontSize: '0.75rem' }}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button 
                className="btn btn-secondary" 
                disabled={currentPage === totalCandidatePages || totalCandidatePages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
                style={{ padding: '5px 10px', fontSize: '0.75rem' }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Create/Edit Position Modal ─── */}
      {isPositionModalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="dashboard-panel" style={{ width: '400px', padding: '2rem', animation: 'fadeIn 0.2s ease-out', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div className="flex-between mb-4">
              <h3 className="card-title" style={{ marginBottom: 0, fontSize: '1.15rem', fontWeight: 700 }}>{editingPositionId ? 'Edit Position' : 'Create Position'}</h3>
              <button onClick={() => setIsPositionModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>
            
            <div className="form-group">
              <label style={{ fontWeight: 500, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Position Title</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. President"
                value={positionFormData.title}
                onChange={(e) => setPositionFormData({...positionFormData, title: e.target.value})}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontWeight: 500, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Maximum Allowed Votes</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="number" 
                  min="1"
                  className="form-control" 
                  value={positionFormData.maxVotes}
                  onChange={(e) => setPositionFormData({...positionFormData, maxVotes: parseInt(e.target.value) || 1})}
                  style={{ width: '80px', padding: '8px', fontSize: '0.95rem', fontWeight: 700, textAlign: 'center' }}
                />
                <p className="text-xs text-secondary" style={{ flex: 1, lineHeight: 1.4, margin: 0 }}>
                  Number of candidates a voter can choose for this position.
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setIsPositionModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#0f172a', color: '#fff' }} onClick={handleSavePosition}>
                {editingPositionId ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ─── Add/Edit Candidate Modal ─── */}
      {isCandidateModalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="dashboard-panel" style={{ width: '440px', padding: '2rem', animation: 'fadeIn 0.2s ease-out', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div className="flex-between mb-4">
              <h3 className="card-title" style={{ marginBottom: 0, fontSize: '1.15rem', fontWeight: 700 }}>{isEditingCandidate ? 'Edit Candidate' : 'Add Candidate'}</h3>
              <button onClick={() => setIsCandidateModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveCandidate}>
              {/* Photo Upload Section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#f5f6f8', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {currentCandidate.photoUrl ? (
                    <img src={currentCandidate.photoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={20} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                  )}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '2px', margin: 0 }}>Candidate Photo</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '6px', margin: '2px 0 6px 0' }}>Upload image, max 2MB.</p>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  <button type="button" className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.7rem' }} onClick={() => fileInputRef.current?.click()}>
                    Choose Image
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 500 }}>Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. John Doe"
                  value={currentCandidate.name}
                  onChange={e => setCurrentCandidate({...currentCandidate, name: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group flex gap-3">
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500 }}>Role / Position</label>
                  <select 
                    className="form-control"
                    value={currentCandidate.position}
                    onChange={e => setCurrentCandidate({...currentCandidate, position: e.target.value})}
                    required
                  >
                    {positions.length === 0 ? (
                      <option value="" disabled>No positions available</option>
                    ) : (
                      positions.map(p => (
                        <option key={p.id} value={p.title}>{p.title}</option>
                      ))
                    )}
                  </select>
                </div>

                <div style={{ width: '120px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500 }}>Class</label>
                  <select 
                    className="form-control"
                    value={currentCandidate.grade}
                    onChange={e => setCurrentCandidate({...currentCandidate, grade: e.target.value})}
                  >
                    {availableGrades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setIsCandidateModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} disabled={!currentCandidate.name || !currentCandidate.position}>
                  {isEditingCandidate ? 'Save Changes' : 'Add Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ─── Delete Position Confirmation Modal ─── */}
      {confirmDeletePositionId && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="dashboard-panel" style={{ width: '380px', padding: '2rem', animation: 'fadeIn 0.2s ease-out', borderRadius: '16px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(220, 38, 38, 0.08)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Trash2 size={24} />
            </div>
            <h3 className="card-title mb-3" style={{ fontSize: '1.15rem', fontWeight: 700 }}>Remove Position?</h3>
            <p className="text-secondary mb-4 text-xs" style={{ lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              Are you sure you want to remove this position? This will also unassign all candidates currently linked to this role. This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-center">
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1 }} onClick={() => setConfirmDeletePositionId(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--danger)', color: 'white', flex: 1 }} onClick={() => { deletePosition(confirmDeletePositionId); setConfirmDeletePositionId(null); }}>Remove</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ─── Delete Candidate Confirmation Modal ─── */}
      {confirmDeleteCandidateId && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="dashboard-panel" style={{ width: '380px', padding: '2rem', animation: 'fadeIn 0.2s ease-out', borderRadius: '16px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(220, 38, 38, 0.08)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Trash2 size={24} />
            </div>
            <h3 className="card-title mb-3" style={{ fontSize: '1.15rem', fontWeight: 700 }}>Remove Candidate?</h3>
            <p className="text-secondary mb-4 text-xs" style={{ lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              Are you sure you want to remove this candidate? This will immediately remove them from the active ballot.
            </p>
            <div className="flex gap-2 justify-center">
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1 }} onClick={() => setConfirmDeleteCandidateId(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--danger)', color: 'white', flex: 1 }} onClick={() => { deleteCandidate(confirmDeleteCandidateId); setConfirmDeleteCandidateId(null); }}>Remove</button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
