import { Card } from '../../../components/ui/Card';
import { Upload, Search } from 'lucide-react';

export default function ManageStudents() {
  const students = [
    { id: '1001', name: 'Michael Jordan', grade: '12th', voted: true },
    { id: '1002', name: 'Serena Williams', grade: '11th', voted: false },
    { id: '1003', name: 'LeBron James', grade: '10th', voted: true },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Students</h1>
          <p>View the voter roster and upload student lists.</p>
        </div>
        <button className="btn btn-primary">
          <Upload size={18} />
          Import CSV
        </button>
      </div>

      <Card>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '300px' }}>
            <Search size={18} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search students..." 
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} 
            />
          </div>
        </div>

        <div className="data-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.grade}</td>
                  <td>
                    {s.voted ? (
                      <span className="badge active">Voted</span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
