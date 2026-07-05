import { Card } from '../../../components/ui/Card';
import { Plus, Edit2, Trash2, ListChecks } from 'lucide-react';

export default function ManageBallot() {
  const positions = [
    { id: 1, title: 'President', maxVotes: 1, candidatesCount: 4 },
    { id: 2, title: 'Vice President', maxVotes: 1, candidatesCount: 3 },
    { id: 3, title: 'Student Council Representatives', maxVotes: 4, candidatesCount: 12 },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Ballot & Positions</h1>
          <p>Organize the structure of your election ballot and set voting rules.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Create Position
        </button>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <Card className="stat-card" style={{ background: 'rgba(139, 92, 246, 0.05)' }}>
          <div className="stat-info">
            <h3>Total Positions</h3>
            <div className="value">{positions.length}</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--accent)', background: 'rgba(139, 92, 246, 0.1)' }}>
            <ListChecks size={28} />
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Active Ballot Structure</h3>
        </div>
        <div className="data-table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
          <table>
            <thead>
              <tr>
                <th>Position Title</th>
                <th>Max Votes Allowed</th>
                <th>Assigned Candidates</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      Select up to {p.maxVotes}
                    </span>
                  </td>
                  <td>{p.candidatesCount} candidates</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--accent)' }} title="Manage Candidates">
                      <ListChecks size={18} />
                    </button>
                    <button className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--text-secondary)' }} title="Edit Position">
                      <Edit2 size={18} />
                    </button>
                    <button className="btn" style={{ padding: '6px', background: 'transparent', color: 'var(--danger)' }} title="Delete Position">
                      <Trash2 size={18} />
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
