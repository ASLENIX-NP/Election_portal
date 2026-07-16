import { useState, useRef, useMemo } from 'react';
import { Card } from '@/components/common/Card';
import { Upload, Search, Plus, Trash2, X, ChevronLeft, ChevronRight, CheckSquare, Square, Users } from 'lucide-react';
import { useKioskContext } from '@/context/KioskContext';
import { useElection } from '@/context/ElectionContext';
import '../dashboard.css';

export default function ManageStudents() {
  const { roster: students, setRoster: setStudents } = useKioskContext();
  const { advancedSettings } = useElection();
  
  const availableGrades = advancedSettings?.availableGrades || ['9th', '10th', '11th', '12th'];

  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ id: '', name: '', grade: availableGrades[0] });
  
  // Table State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVoters, setSelectedVoters] = useState(new Set());
  const itemsPerPage = 10;
  
  const fileInputRef = useRef(null);

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.id) return;
    setStudents([...students, { ...newStudent, status: 'eligible' }]);
    setShowModal(false);
    setNewStudent({ id: '', name: '', grade: '10th' });
  };

  const removeStudent = (id) => {
    if(window.confirm('Are you sure you want to remove this voter?')) {
      setStudents(students.filter(s => s.id !== id));
      setSelectedVoters(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleBulkDelete = () => {
    if(selectedVoters.size === 0) return;
    if(window.confirm(`Are you sure you want to remove ${selectedVoters.size} voters?`)) {
      setStudents(students.filter(s => !selectedVoters.has(s.id)));
      setSelectedVoters(new Set());
    }
  };

  const toggleSelectAll = () => {
    if (selectedVoters.size === currentItems.length && currentItems.length > 0) {
      setSelectedVoters(new Set());
    } else {
      setSelectedVoters(new Set(currentItems.map(s => s.id)));
    }
  };

  const toggleSelect = (id) => {
    setSelectedVoters(prev => {
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


  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        
        const newVoters = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 2) {
            newVoters.push({
              id: cols[0] || `PASS-${Math.floor(Math.random()*10000)}`,
              name: cols[1] || 'Unknown',
              grade: cols[2] || '10th',
              status: 'eligible'
            });
          }
        }
        
        if (newVoters.length > 0) {
          setStudents(prev => {
            const existingIds = new Set(prev.map(s => s.id));
            const uniqueNewVoters = newVoters.filter(v => !existingIds.has(v.id));
            return [...prev, ...uniqueNewVoters];
          });
          alert(`Successfully imported ${newVoters.length} voters.`);
        } else {
          alert('No valid rows found in CSV. Expected format: ID,Name,Grade');
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredAndSorted = useMemo(() => {
    let result = students;
    
    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(s => 
        (s.name && s.name.toLowerCase().includes(lower)) || 
        (s.id && s.id.toLowerCase().includes(lower)) ||
        (s.grade && s.grade.toLowerCase().includes(lower))
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
  }, [students, searchTerm, sortField, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const currentItems = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return <span style={{ fontSize: '0.7rem', marginLeft: '4px' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <>
      <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#0f172a', margin: '0 0 4px 0' }}>
            Voter Registry
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            Manage voter roster — add manually or upload CSV
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Plus size={15} />
            Add Voter
          </button>
          <input 
            type="file" 
            accept=".csv" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleCSVImport}
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="btn"
            style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '7px 14px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'inherit' }}
          >
            <Upload size={15} />
            Import CSV
          </button>
        </div>
      </div>

      <div className="dashboard-panel">
        {/* Toolbar */}
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
          <div className="form-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '320px', background: 'var(--surface-hover)', borderRadius: '8px', padding: '10px 16px' }}>
            <Search size={18} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search by ID, name, or grade..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }} 
            />
          </div>

          {selectedVoters.size > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <strong>{selectedVoters.size}</strong> selected
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
                  {selectedVoters.size === currentItems.length && currentItems.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                </th>
                <th onClick={() => handleSort('id')}>Voter ID <SortIcon field="id" /></th>
                <th onClick={() => handleSort('name')}>Name <SortIcon field="name" /></th>
                <th onClick={() => handleSort('grade')}>Grade <SortIcon field="grade" /></th>
                <th onClick={() => handleSort('status')}>Status <SortIcon field="status" /></th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No voters found matching your criteria.</td>
                </tr>
              ) : currentItems.map(s => (
                <tr key={s.id} className={selectedVoters.has(s.id) ? 'selected' : ''}>
                  <td onClick={() => toggleSelect(s.id)} style={{ cursor: 'pointer' }}>
                    {selectedVoters.has(s.id) ? <CheckSquare size={18} color="var(--accent)" /> : <Square size={18} color="var(--text-muted)" />}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.id}</td>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.grade}</td>
                  <td>
                    {s.status === 'voted' ? (
                      <span className="badge active">Voted</span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-secondary)' }}>Eligible</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--danger)' }} onClick={() => removeStudent(s.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {filteredAndSorted.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} of {filteredAndSorted.length} voters
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
      </div>

      {/* Add Voter Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="dashboard-panel" style={{ width: '400px', padding: '2.5rem', animation: 'fadeIn 0.2s ease-out', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add Voter</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddStudent}>
              <div className="form-group">
                <label>Voting Pass / ID</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. PASS-1004"
                  value={newStudent.id}
                  onChange={e => setNewStudent({...newStudent, id: e.target.value})}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Emma Watson"
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Grade / Class</label>
                <select 
                  className="form-control"
                  value={newStudent.grade}
                  onChange={e => setNewStudent({...newStudent, grade: e.target.value})}
                >
                  {availableGrades.map(grade => (
                    <option key={grade} value={grade}>{grade} Class</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Voter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
