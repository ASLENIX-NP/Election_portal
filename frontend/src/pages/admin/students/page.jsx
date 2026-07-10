import { useState, useRef, useMemo } from 'react';
import { Card } from '@/components/common/Card';
import { Upload, Search, Plus, Trash2, X, ChevronLeft, ChevronRight, CheckSquare, Square, Download, Key } from 'lucide-react';
import { useKioskContext } from '@/context/KioskContext';

export default function ManageStudents() {
  const { roster: students, setRoster: setStudents, generateCredentials } = useKioskContext();

  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ id: '', name: '', grade: '10th' });
  
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

  const handleGenerateCredentials = () => {
    if (selectedVoters.size > 0) {
      if(window.confirm(`Generate new credentials for ${selectedVoters.size} selected voters? (Existing credentials will NOT be overwritten)`)) {
        generateCredentials(selectedVoters);
        setSelectedVoters(new Set());
      }
    } else {
      if(window.confirm(`Generate new credentials for ALL voters without one?`)) {
        generateCredentials(null);
      }
    }
  };

  const downloadCredentialsCSV = () => {
    const header = "Voter ID,Name,Grade,Voting Code\n";
    const rows = students.map(s => `${s.id},"${s.name}",${s.grade},${s.credential || 'NONE'}`).join('\n');
    const csvContent = header + rows;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `voter_credentials_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Manage Voters</h1>
          <p>View the voter roster, add manually, or upload CSV lists.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Add Voter
          </button>
          <input 
            type="file" 
            accept=".csv" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleCSVImport}
          />
          <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} />
            Import CSV
          </button>
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
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

          {selectedVoters.size > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <strong>{selectedVoters.size}</strong> selected
              </span>
              <button className="btn btn-secondary" onClick={handleGenerateCredentials} style={{ padding: '8px 16px' }}>
                <Key size={16} /> Generate PINs
              </button>
              <button className="btn btn-danger" onClick={handleBulkDelete} style={{ padding: '8px 16px' }}>
                <Trash2 size={16} /> Bulk Delete
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={handleGenerateCredentials} style={{ padding: '8px 16px' }}>
                <Key size={16} /> Generate PINs
              </button>
              <button className="btn btn-secondary" onClick={downloadCredentialsCSV} style={{ padding: '8px 16px' }}>
                <Download size={16} /> Export CSV
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
                <th onClick={() => handleSort('credential')}>PIN <SortIcon field="credential" /></th>
                <th onClick={() => handleSort('status')}>Status <SortIcon field="status" /></th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No voters found matching your criteria.</td>
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
                    {s.credential ? (
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '2px', color: 'var(--accent)', background: 'var(--surface-hover)', padding: '4px 8px', borderRadius: '6px' }}>{s.credential}</span>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>None</span>
                    )}
                  </td>
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
      </Card>

      {/* Add Voter Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <Card style={{ width: '400px', padding: '2rem', margin: '0' }}>
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
                <label>Grade</label>
                <select 
                  className="form-control"
                  value={newStudent.grade}
                  onChange={e => setNewStudent({...newStudent, grade: e.target.value})}
                >
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Voter</button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
