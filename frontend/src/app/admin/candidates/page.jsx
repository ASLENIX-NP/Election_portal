import { Card } from '../../../components/ui/Card';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ManageCandidates() {
  const candidates = [
    { id: 1, name: 'John Doe', position: 'President', grade: '12th' },
    { id: 2, name: 'Jane Smith', position: 'President', grade: '11th' },
    { id: 3, name: 'Alice Williams', position: 'Vice President', grade: '11th' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Candidates</h1>
          <p>Add, edit, or remove election candidates.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Add Candidate
        </button>
      </div>

      <Card>
        <div className="data-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Grade</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{c.name}</div>
                  </td>
                  <td>{c.position}</td>
                  <td>{c.grade}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--text-secondary)' }}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--danger)' }}>
                      <Trash2 size={16} />
                    </button>
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
