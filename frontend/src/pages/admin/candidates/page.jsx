import { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Card } from '@/components/common/Card';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Award, Users, Search, ChevronLeft, ChevronRight, CheckSquare, Square, UserPlus } from 'lucide-react';
import { useElection } from '@/context/ElectionContext';
import '../dashboard.css';

export default function ManageCandidates() {
  const { candidates, positions, addCandidate, updateCandidate, deleteCandidate } = useElection();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState({ id: null, name: '', position: '', grade: '10th', photoUrl: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  
  // Table State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());
  const itemsPerPage = 10;
  
  const fileInputRef = useRef(null);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCandidate({ id: null, name: '', position: positions[0]?.title || '', grade: '10th', photoUrl: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (candidate) => {
    setIsEditing(true);
    setCurrentCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleSaveCandidate = (e) => {
    e.preventDefault();
    if (!currentCandidate.name || !currentCandidate.position) return;

    if (isEditing) {
      updateCandidate(currentCandidate.id, currentCandidate);
    } else {
      addCandidate(currentCandidate);
    }
    
    setIsModalOpen(false);
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

  const handleBulkDelete = () => {
    if(selectedCandidates.size === 0) return;
    if(window.confirm(`Are you sure you want to remove ${selectedCandidates.size} candidates?`)) {
      selectedCandidates.forEach(id => deleteCandidate(id));
      setSelectedCandidates(new Set());
    }
  };

  const toggleSelectAll = () => {
    if (selectedCandidates.size === currentItems.length && currentItems.length > 0) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(currentItems.map(c => c.id)));
    }
  };

  const toggleSelect = (id) => {
    setSelectedCandidates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filteredAndSorted = useMemo(() => {
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

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const currentItems = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return <span style={{ fontSize: '0.7rem', marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
            <div style={{ padding: '10px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '14px', display: 'flex', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
              <Users size={24} color="#8b5cf6" />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', margin: 0 }}>
              Manage Candidates
            </h1>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
            Add, edit, or remove candidates, and manage their profiles.
          </p>
        </div>
        <button 
          onClick={openAddModal} 
          style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(15,23,42,0.2)', transition: 'transform 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <UserPlus size={18} />
          Add Candidate
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="dashboard-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>Total Candidates</p>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}>
              <Users size={20} color="#fff" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>{candidates.length}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-panel">
        {/* Toolbar */}
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
          <div className="form-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '320px', background: 'var(--surface-hover)', borderRadius: '8px', padding: '10px 16px' }}>
            <Search size={18} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search by name, position, or grade..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }} 
            />
          </div>

          {selectedCandidates.size > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <strong>{selectedCandidates.size}</strong> selected
              </span>
              <button className="btn btn-danger" onClick={handleBulkDelete} style={{ padding: '8px 16px' }}>
                <Trash2 size={16} /> Bulk Delete
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }} onClick={toggleSelectAll}>
                  {selectedCandidates.size === currentItems.length && currentItems.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                </th>
                <th>Profile</th>
                <th onClick={() => handleSort('name')}>Name <SortIcon field="name" /></th>
                <th onClick={() => handleSort('position')}>Position <SortIcon field="position" /></th>
                <th onClick={() => handleSort('grade')}>Grade <SortIcon field="grade" /></th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No candidates found matching your criteria.</td>
                </tr>
              ) : currentItems.map(c => (
                <tr key={c.id} className={selectedCandidates.has(c.id) ? 'selected' : ''}>
                  <td onClick={() => toggleSelect(c.id)} style={{ cursor: 'pointer' }}>
                    {selectedCandidates.has(c.id) ? <CheckSquare size={18} color="var(--accent)" /> : <Square size={18} color="var(--text-muted)" />}
                  </td>
                  <td>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: c.photoUrl ? 'transparent' : 'var(--surface-hover)', border: `1px solid ${c.color || 'var(--border-color)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {c.photoUrl ? (
                        <img src={c.photoUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: c.color || 'var(--text-primary)' }}>{c.avatar || c.name.charAt(0)}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)' }}>{c.position}</span>
                  </td>
                  <td>{c.grade}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--text-primary)' }} onClick={() => openEditModal(c)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--danger)' }} onClick={() => setConfirmDeleteId(c.id)} title="Remove">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {filteredAndSorted.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} of {filteredAndSorted.length} candidates
          </span>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-secondary" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              style={{ padding: '6px 12px' }}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button 
              className="btn btn-secondary" 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              style={{ padding: '6px 12px' }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="dashboard-panel" style={{ width: '480px', padding: '2.5rem', animation: 'fadeIn 0.2s ease-out', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)' }}>
            <div className="flex-between mb-6">
              <h3 className="card-title" style={{ marginBottom: 0 }}>{isEditing ? 'Edit Candidate' : 'Add Candidate'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveCandidate}>
              {/* Photo Upload Section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-hover)', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {currentCandidate.photoUrl ? (
                    <img src={currentCandidate.photoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={24} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                  )}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Candidate Photo</h4>
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
                  placeholder="e.g. John Doe"
                  value={currentCandidate.name}
                  onChange={e => setCurrentCandidate({...currentCandidate, name: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group flex gap-4">
                <div style={{ flex: 1 }}>
                  <label>Role / Position</label>
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
                  <label>Grade</label>
                  <select 
                    className="form-control"
                    value={currentCandidate.grade}
                    onChange={e => setCurrentCandidate({...currentCandidate, grade: e.target.value})}
                  >
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={!currentCandidate.name || !currentCandidate.position}>
                  {isEditing ? 'Save Changes' : 'Add Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {confirmDeleteId && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="dashboard-panel" style={{ width: '400px', padding: '2.5rem', animation: 'fadeIn 0.2s ease-out', borderRadius: '24px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Trash2 size={32} />
            </div>
            <h3 className="card-title mb-3" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Remove Candidate?</h3>
            <p className="text-secondary mb-8 text-sm" style={{ lineHeight: 1.6 }}>Are you sure you want to remove this candidate? This will immediately remove them from the active ballot.</p>
            <div className="flex gap-3 justify-center">
              <button className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, flex: 1 }} onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="btn" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, background: 'var(--danger)', color: 'white', flex: 1 }} onClick={() => { deleteCandidate(confirmDeleteId); setConfirmDeleteId(null); }}>Yes, Remove</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
