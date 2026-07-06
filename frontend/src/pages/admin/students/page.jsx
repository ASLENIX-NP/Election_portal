import { useState, useRef } from 'react';
import { Card } from '@/components/common/Card';
import { Upload, Search, Plus, Trash2, X } from 'lucide-react';

export default function ManageStudents() {
  const [students, setStudents] = useState([
    { id: '1001', name: 'Michael Jordan', grade: '12th', voted: true },
    { id: '1002', name: 'Serena Williams', grade: '11th', voted: false },
    { id: '1003', name: 'LeBron James', grade: '10th', voted: true },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ id: '', name: '', grade: '10th' });
  const fileInputRef = useRef(null);

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.id) return;
    setStudents([...students, { ...newStudent, voted: false }]);
    setShowModal(false);
    setNewStudent({ id: '', name: '', grade: '10th' });
  };

  const removeStudent = (id) => {
    if(window.confirm('Are you sure you want to remove this voter?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Simulated import of ${file.name}. 350 voters added successfully.`);
      // Mocking the addition of voters
      setStudents(prev => [
        ...prev, 
        { id: '9001', name: 'Imported User 1', grade: '11th', voted: false },
        { id: '9002', name: 'Imported User 2', grade: '12th', voted: false }
      ]);
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
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

      <Card>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '300px' }}>
            <Search size={18} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search voters..." 
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} 
            />
          </div>
        </div>

        <div className="data-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Voter ID</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No voters found.</td>
                </tr>
              ) : students.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>{s.grade}</td>
                  <td>
                    {s.voted ? (
                      <span className="badge active">Voted</span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>Pending</span>
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
      </Card>

      {/* Add Voter Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <Card style={{ width: '400px', padding: '2rem', margin: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Add Voter</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddStudent}>
              <div className="form-group">
                <label>Voter ID / Student ID</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. 1004"
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

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
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
