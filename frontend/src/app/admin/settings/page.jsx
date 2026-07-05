import { Card } from '../../../components/ui/Card';
import { Power, Settings as SettingsIcon } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Election Settings</h1>
          <p>Configure and control the election lifecycle.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon" style={{ color: 'var(--danger)' }}>
              <Power size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Election Status Control</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Currently: <strong>Active</strong></p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }}>
              End Election
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              Pause Voting
            </button>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon" style={{ color: 'var(--accent)' }}>
              <SettingsIcon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>General Configuration</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Basic election details</p>
            </div>
          </div>

          <div className="form-group">
            <label>Election Title</label>
            <input type="text" className="form-control" defaultValue="Student Council Election 2026" />
          </div>

          <div className="form-group">
            <label>Academic Year</label>
            <input type="text" className="form-control" defaultValue="2026-2027" />
          </div>

          <button className="btn btn-primary">Save Changes</button>
        </Card>
      </div>
    </div>
  );
}
