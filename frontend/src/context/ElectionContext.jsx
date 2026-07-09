import { createContext, useContext, useState, useEffect } from 'react';

const ElectionContext = createContext();

export function ElectionProvider({ children }) {
  const [electionTitle, setElectionTitle] = useState('Student Council Election 2026');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [status, setStatus] = useState('Active');
  
  // Dashboard Live State
  const [totalVotes, setTotalVotes] = useState(1250);
  const [totalEligible, setTotalEligible] = useState(2000);
  
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'John Doe', position: 'President', votes: 600, color: '#3b82f6', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', position: 'President', votes: 500, color: '#8b5cf6', avatar: 'JS' },
    { id: 11, name: 'Michael Chen', position: 'President', votes: 150, color: '#10b981', avatar: 'MC' },
    { id: 3, name: 'Alice W.', position: 'Vice President', votes: 750, color: '#06b6d4', avatar: 'AW' },
    { id: 4, name: 'Bob M.', position: 'Vice President', votes: 500, color: '#f59e0b', avatar: 'BM' },
    { id: 5, name: 'Emma Watson', position: 'Student Council Representatives', votes: 980, color: '#ec4899', avatar: 'EW' },
    { id: 6, name: 'LeBron James', position: 'Student Council Representatives', votes: 850, color: '#f43f5e', avatar: 'LJ' },
    { id: 7, name: 'Serena W.', position: 'Student Council Representatives', votes: 720, color: '#8b5cf6', avatar: 'SW' },
    { id: 8, name: 'Tom Holland', position: 'Student Council Representatives', votes: 610, color: '#3b82f6', avatar: 'TH' },
    { id: 9, name: 'Zendaya', position: 'Student Council Representatives', votes: 890, color: '#10b981', avatar: 'Z' }
  ]);

  const [positions, setPositions] = useState([
    { id: 1, title: 'President', maxVotes: 1 },
    { id: 2, title: 'Vice President', maxVotes: 1 },
    { id: 3, title: 'Student Council Representatives', maxVotes: 4 },
  ]);

  const [trendData, setTrendData] = useState([
    { time: '08:00', votes: 45 },
    { time: '09:00', votes: 120 },
    { time: '10:00', votes: 230 },
    { time: '11:00', votes: 450 },
    { time: '12:00', votes: 780 },
    { time: '13:00', votes: 1050 },
    { time: '14:00', votes: 1250 },
  ]);

  const [demoData, setDemoData] = useState([
    { name: 'Grade 9', value: 250 },
    { name: 'Grade 10', value: 300 },
    { name: 'Grade 11', value: 320 },
    { name: 'Grade 12', value: 380 },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'vote', message: 'Vote cast in Grade 12 sector', time: 'Just now', hash: '0x7f8a...3b21' },
    { id: 5, type: 'vote', message: 'Vote cast in Grade 10 sector', time: '1 min ago', hash: '0x1c4d...8a92' },
    { id: 2, type: 'system', message: 'System health check passed', time: '2 mins ago', hash: 'sys_ok_091' },
    { id: 3, type: 'vote', message: 'Vote cast in Grade 11 sector', time: '5 mins ago', hash: '0x9a12...ff90' },
    { id: 4, type: 'alert', message: 'Failed login attempt (IP: 192.168.1.4)', time: '12 mins ago', hash: 'sec_warn_11' },
  ]);

  useEffect(() => {
    const savedTitle = localStorage.getItem('electionTitle');
    if (savedTitle) setElectionTitle(savedTitle);
    
    const savedYear = localStorage.getItem('academicYear');
    if (savedYear) setAcademicYear(savedYear);
  }, []);

  const [advancedSettings, setAdvancedSettings] = useState({
    requireOTP: false,
    singleDevice: true,
    scheduledVoting: false,
    startTime: '',
    endTime: '',
    voterReceipts: true,
    strictAnonymity: true,
    brandColor: '#3b82f6',
    schoolLogo: ''
  });

  const updateAdvancedSettings = (newSettings) => {
    setAdvancedSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Automated Election Scheduling Logic
  useEffect(() => {
    if (!advancedSettings.scheduledVoting || !advancedSettings.startTime || !advancedSettings.endTime) {
      return;
    }

    const checkSchedule = () => {
      const now = new Date();
      const start = new Date(advancedSettings.startTime);
      const end = new Date(advancedSettings.endTime);

      if (now < start) {
        if (status !== 'Scheduled') setStatus('Scheduled');
      } else if (now >= start && now <= end) {
        if (status !== 'Active') {
          setStatus('Active');
          setRecentActivity(prev => [
            { id: Date.now(), type: 'system', message: 'Election automatically activated by schedule', time: 'Just now', hash: 'sys_auto_start' },
            ...prev.slice(0, 4)
          ]);
        }
      } else if (now > end) {
        if (status !== 'Ended') {
          setStatus('Ended');
          setRecentActivity(prev => [
            { id: Date.now(), type: 'system', message: 'Election automatically ended by schedule', time: 'Just now', hash: 'sys_auto_end' },
            ...prev.slice(0, 4)
          ]);
        }
      }
    };

    // Check immediately, then every 10 seconds
    checkSchedule();
    const interval = setInterval(checkSchedule, 10000);
    return () => clearInterval(interval);
  }, [advancedSettings.scheduledVoting, advancedSettings.startTime, advancedSettings.endTime, status]);

  const updateElectionConfig = (title, year) => {
    setElectionTitle(title);
    setAcademicYear(year);
    localStorage.setItem('electionTitle', title);
    localStorage.setItem('academicYear', year);
  };

  const processCsvData = (csvText) => {
    // Simple CSV parser assuming format: Timestamp,Grade,PresidentChoice,VPChoice
    const rows = csvText.split('\n').map(r => r.trim()).filter(r => r && !r.startsWith('Timestamp'));
    if (rows.length === 0) return;

    // Reset counts for streaming
    setTotalVotes(0);
    setCandidates(prev => prev.map(c => ({ ...c, votes: 0 })));
    setDemoData([
      { name: 'Grade 9', value: 0 },
      { name: 'Grade 10', value: 0 },
      { name: 'Grade 11', value: 0 },
      { name: 'Grade 12', value: 0 },
    ]);
    setTrendData([]);
    setRecentActivity([{ id: Date.now(), type: 'system', message: 'CSV Import Started. Ledger re-syncing...', time: 'Just now', hash: 'sys_import' }]);

    let currentIndex = 0;
    const interval = setInterval(() => {
      // Process batch of 5 votes per tick for dramatic effect
      for(let i=0; i<5; i++) {
        if (currentIndex >= rows.length) {
            clearInterval(interval);
            setRecentActivity(prev => [{ id: Date.now(), type: 'system', message: 'Ledger sync complete', time: 'Just now', hash: 'sys_sync_ok' }, ...prev.slice(0, 4)]);
            return;
        }

        const [ts, grade, pres, vp] = rows[currentIndex].split(',');
        currentIndex++;

        setTotalVotes(prev => prev + 1);

        setCandidates(prev => prev.map(c => {
          if (c.position === 'President' && c.name.toLowerCase().includes(pres.toLowerCase())) return { ...c, votes: c.votes + 1 };
          if (c.position === 'Vice President' && c.name.toLowerCase().includes(vp.toLowerCase())) return { ...c, votes: c.votes + 1 };
          return c;
        }));

        setDemoData(prev => {
          const index = prev.findIndex(d => d.name === grade);
          if (index >= 0) {
            const next = [...prev];
            next[index].value += 1;
            return next;
          }
          return prev;
        });

        if (currentIndex % 10 === 0) {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setTrendData(prev => {
              if (prev.length > 0 && prev[prev.length - 1].time === timeStr) {
                  return [...prev.slice(0, -1), { time: timeStr, votes: prev[prev.length - 1].votes + 10 }];
              }
              return [...prev, { time: timeStr, votes: currentIndex }];
            });
            setRecentActivity(prev => [
                { id: Date.now() + i, type: 'vote', message: `Batch votes recorded (${grade})`, time: 'Just now', hash: `0x${Math.random().toString(16).substr(2, 8)}` },
                ...prev.slice(0, 4)
            ]);
        }
      }
    }, 150); // Fast stream
  };

  const resetData = () => {
    setTotalVotes(0);
    setCandidates(prev => prev.map(c => ({ ...c, votes: 0 })));
    setDemoData([
      { name: 'Grade 9', value: 0 },
      { name: 'Grade 10', value: 0 },
      { name: 'Grade 11', value: 0 },
      { name: 'Grade 12', value: 0 },
    ]);
    setTrendData([]);
    setRecentActivity([{ id: Date.now(), type: 'alert', message: 'All election data has been reset', time: 'Just now', hash: 'sys_reset' }]);
  };

  const castBallot = (candidateIds) => {
    setTotalVotes(prev => prev + 1);
    setCandidates(prev => prev.map(c => {
      if (candidateIds.includes(c.id)) {
        return { ...c, votes: c.votes + 1 };
      }
      return c;
    }));
    
    // Add activity log
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRecentActivity(prev => [
      { id: Date.now(), type: 'vote', message: 'Vote cast securely via kiosk', time: timeStr, hash: `0x${Math.random().toString(16).substr(2, 8)}` },
      ...prev.slice(0, 4)
    ]);
    
    // Update trend data roughly
    setTrendData(prev => {
      if (prev.length > 0 && prev[prev.length - 1].time === timeStr) {
          return [...prev.slice(0, -1), { time: timeStr, votes: prev[prev.length - 1].votes + 1 }];
      }
      return [...prev, { time: timeStr, votes: totalVotes + 1 }];
    });
  };

  const addPosition = (title, maxVotes) => {
    setPositions(prev => [...prev, { id: Date.now(), title, maxVotes: parseInt(maxVotes) || 1 }]);
  };

  const updatePosition = (id, title, maxVotes) => {
    setPositions(prev => prev.map(p => p.id === id ? { ...p, title, maxVotes: parseInt(maxVotes) || 1 } : p));
  };

  const deletePosition = (id) => {
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  const addCandidate = (candidateData) => {
    const newCandidate = {
      ...candidateData,
      id: Date.now(),
      votes: 0,
      avatar: candidateData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      color: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)]
    };
    setCandidates(prev => [...prev, newCandidate]);
  };

  const updateCandidate = (id, candidateData) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...candidateData } : c));
  };

  const deleteCandidate = (id) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  const [moderators, setModerators] = useState([
    { id: 1, name: 'Mr. Anderson', email: 'anderson@school.edu', role: 'Chief Moderator', photoUrl: '', color: '#3b82f6', avatar: 'MA' },
    { id: 2, name: 'Mrs. Davis', email: 'davis@school.edu', role: 'Station Monitor', photoUrl: '', color: '#8b5cf6', avatar: 'MD' },
  ]);

  const addModerator = (modData) => {
    const newMod = {
      ...modData,
      id: Date.now(),
      avatar: modData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      color: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'][Math.floor(Math.random() * 6)]
    };
    setModerators(prev => [...prev, newMod]);
  };

  const updateModerator = (id, modData) => {
    setModerators(prev => prev.map(m => m.id === id ? { ...m, ...modData } : m));
  };

  const deleteModerator = (id) => {
    setModerators(prev => prev.filter(m => m.id !== id));
  };

  return (
    <ElectionContext.Provider value={{ 
      electionTitle, academicYear, status, updateElectionConfig, setStatus,
      totalVotes, totalEligible, candidates, trendData, demoData, recentActivity,
      positions, addPosition, updatePosition, deletePosition,
      addCandidate, updateCandidate, deleteCandidate,
      moderators, addModerator, updateModerator, deleteModerator,
      advancedSettings, updateAdvancedSettings,
      processCsvData, resetData, castBallot
    }}>
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  return useContext(ElectionContext);
}
