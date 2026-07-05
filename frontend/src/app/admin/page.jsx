import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import ChartWidget from '../../components/admin/ChartWidget';
import { Users, UserCheck, Activity, Download, FileText } from 'lucide-react';
import { generateElectionPDF, generateElectionCSV } from '../../utils/ReportGenerator';

export default function AdminDashboard() {
  // Mock Data States
  const [totalVotes, setTotalVotes] = useState(842);
  
  const [chartData, setChartData] = useState([
    { name: 'John Doe (Pres)', votes: 420 },
    { name: 'Jane Smith (Pres)', votes: 310 },
    { name: 'Alice W. (VP)', votes: 505 },
    { name: 'Bob M. (VP)', votes: 200 }
  ]);

  const stats = [
    { label: 'Total Eligible Voters', value: '1,250', icon: Users, color: 'var(--accent-cyan)' },
    { label: 'Votes Cast', value: totalVotes.toLocaleString(), icon: UserCheck, color: 'var(--success)' },
    { label: 'Turnout Rate', value: ((totalVotes / 1250) * 100).toFixed(1) + '%', icon: Activity, color: 'var(--accent-pink)' }
  ];

  // Mock WebSocket Real-Time Updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly decide if a vote came in
      if (Math.random() > 0.6) {
        setTotalVotes(prev => prev + 1);
        
        // Randomly assign the vote to a candidate to animate the chart
        setChartData(prevData => {
          const randomIndex = Math.floor(Math.random() * prevData.length);
          return prevData.map((item, index) => 
            index === randomIndex ? { ...item, votes: item.votes + 1 } : item
          );
        });
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            Dashboard Overview
            <span className="badge active" style={{ fontSize: '0.6rem', padding: '4px 8px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', marginRight: '4px', animation: 'pulse 2s infinite' }}></span>
              LIVE
            </span>
          </h1>
          <p>Real-time statistics for the current election.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => generateElectionCSV(chartData)}>
            <FileText size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => generateElectionPDF(stats, chartData)}>
            <Download size={16} /> Official PDF Report
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {stats.map((stat, i) => (
          <Card key={i} className="stat-card">
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <div className="value">{stat.value}</div>
            </div>
            <div className="stat-icon" style={{ color: stat.color }}>
              <stat.icon size={28} />
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Live Voting Results</h3>
        <ChartWidget data={chartData} />
      </Card>
    </div>
  );
}
