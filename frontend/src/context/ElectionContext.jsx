import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const ElectionContext = createContext();

export function ElectionProvider({ children }) {
  const [electionTitle, setElectionTitle] = useState('Student Council Election 2026');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [status, setStatus] = useState('Active');
  
  // Dashboard Live State
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalEligible, setTotalEligible] = useState(50); // Set to 50 to match the generated mockRoster
  const [isPublished, setIsPublished] = useState(false);
  
  const togglePublish = () => {
    setIsPublished(prev => {
      const next = !prev;
      const channel = new BroadcastChannel('election_sync');
      channel.postMessage({ type: 'SET_PUBLISHED', payload: next });
      channel.close();
      return next;
    });
  };
  
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  
  // Real-time socket connection
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('newVote', (data) => {
      // Refresh candidates data to get latest votes
      const fetchData = async () => {
        try {
          const candRes = await fetch('http://localhost:5000/api/candidates');
          if (candRes.ok) setCandidates(await candRes.json());
        } catch (err) {
          console.error("Failed to fetch updated candidates:", err);
        }
      };
      fetchData();
      
      setTotalVotes(prev => {
        const nextTotal = prev + 1;
        const timeStr = new Date(data.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        setTrendData(prevTrend => {
          if (prevTrend.length > 0 && prevTrend[prevTrend.length - 1].time === timeStr) {
            return [...prevTrend.slice(0, -1), { time: timeStr, votes: prevTrend[prevTrend.length - 1].votes + 1 }];
          }
          return [...prevTrend, { time: timeStr, votes: nextTotal }];
        });
        
        return nextTotal;
      });
      
      setRecentActivity(prev => [
        { id: Date.now() + Math.random(), type: 'vote', message: 'New vote recorded via Kiosk', time: 'Just now', hash: `0x${Math.random().toString(16).substr(2, 8)}` },
        ...prev.slice(0, 4)
      ]);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posRes = await fetch('http://localhost:5000/api/positions');
        if (posRes.ok) setPositions(await posRes.json());

        const candRes = await fetch('http://localhost:5000/api/candidates');
        if (candRes.ok) setCandidates(await candRes.json());
      } catch (err) {
        console.error("Failed to fetch election data:", err);
      }
    };
    fetchData();
  }, []);

  const [trendData, setTrendData] = useState([]);

  const [demoData, setDemoData] = useState([
    { name: 'Grade 9', value: 0 },
    { name: 'Grade 10', value: 0 },
    { name: 'Grade 11', value: 0 },
    { name: 'Grade 12', value: 0 },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'system', message: 'System initialized successfully', time: 'Just now', hash: 'sys_init_001' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsRes = await fetch('http://localhost:5000/api/elections/settings');
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setElectionTitle(settings.title);
          setStatus(settings.status);
        }

        const modsRes = await fetch('http://localhost:5000/api/moderators');
        if (modsRes.ok) setModerators(await modsRes.json());
      } catch (err) {
        console.error("Failed to fetch settings/mods:", err);
      }
    };
    fetchData();
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      try {
        if (e.key === 'electionModerators' && e.newValue) setModerators(JSON.parse(e.newValue));
      } catch(err) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
    schoolLogo: '',
    eligibleGrades: ['9th', '10th', '11th', '12th'],
    availableGrades: ['9th', '10th', '11th', '12th']
  });

  const updateAdvancedSettings = (newSettings) => {
    setAdvancedSettings(prev => {
      const next = { ...prev, ...newSettings };
      const channel = new BroadcastChannel('election_sync');
      channel.postMessage({ type: 'SET_ADVANCED_SETTINGS', payload: next });
      channel.close();
      return next;
    });
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

  const updateElectionConfig = async (title, year) => {
    setElectionTitle(title);
    setAcademicYear(year);
    try {
      await fetch('http://localhost:5000/api/elections/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
    } catch(err) { console.error(err); }
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
    setIsPublished(false);
    setIsPublished(false);
    setRecentActivity([{ id: Date.now(), type: 'alert', message: 'All election data has been reset', time: 'Just now', hash: 'sys_reset' }]);
  };

  useEffect(() => {
    const channel = new BroadcastChannel('election_sync');
    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'VOTE_CAST') {
        applyVoteLocally(payload.candidateIds, payload.timeStr, payload.hash);
      } else if (type === 'SET_PUBLISHED') {
        setIsPublished(payload);
      } else if (type === 'SET_ADVANCED_SETTINGS') {
        setAdvancedSettings(payload);
      }
    };
    return () => channel.close();
  }, []);

  const applyVoteLocally = (candidateIds, timeStr, hash) => {
    setTotalVotes(prev => {
      const nextTotal = prev + 1;
      setTrendData(prevTrend => {
        if (prevTrend.length > 0 && prevTrend[prevTrend.length - 1].time === timeStr) {
            return [...prevTrend.slice(0, -1), { time: timeStr, votes: prevTrend[prevTrend.length - 1].votes + 1 }];
        }
        return [...prevTrend, { time: timeStr, votes: nextTotal }];
      });
      return nextTotal;
    });
    setCandidates(prev => prev.map(c => {
      if (candidateIds.includes(c.id)) {
        return { ...c, votes: c.votes + 1 };
      }
      return c;
    }));
    setRecentActivity(prev => [
      { id: Date.now() + Math.random(), type: 'vote', message: 'Vote cast securely via kiosk', time: timeStr, hash },
      ...prev.slice(0, 4)
    ]);
  };

  const castBallot = async (candidateIds, studentId) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hash = `0x${Math.random().toString(16).substr(2, 8)}`;
    
    try {
      const res = await fetch('http://localhost:5000/api/votes/cast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateIds, studentId })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to cast vote');
      }
      
      applyVoteLocally(candidateIds, timeStr, hash);
      
      const channel = new BroadcastChannel('election_sync');
      channel.postMessage({ type: 'VOTE_CAST', payload: { candidateIds, timeStr, hash } });
      channel.close();
      
      return true;
    } catch(err) {
      console.error("Failed to cast vote securely:", err.message);
      return false;
    }
  };

  const addPosition = async (title, maxVotes) => {
    try {
      const res = await fetch('http://localhost:5000/api/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, maxVotes: parseInt(maxVotes) || 1 })
      });
      if (res.ok) {
        const newPos = await res.json();
        setPositions(prev => [...prev, newPos]);
      }
    } catch(err) { console.error("Failed to add position", err); }
  };

  const updatePosition = (id, title, maxVotes) => {
    setPositions(prev => prev.map(p => p.id === id ? { ...p, title, maxVotes: parseInt(maxVotes) || 1 } : p));
  };

  const deletePosition = (id) => {
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  const addCandidate = async (candidateData) => {
    try {
      const res = await fetch('http://localhost:5000/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData)
      });
      if (res.ok) {
        const newCandidate = await res.json();
        setCandidates(prev => [...prev, newCandidate]);
      }
    } catch(err) { console.error("Failed to add candidate", err); }
  };

  const updateCandidate = async (id, candidateData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/candidates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData)
      });
      if (res.ok) {
        const updatedCandidate = await res.json();
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...updatedCandidate } : c));
      }
    } catch(err) { console.error("Failed to update candidate", err); }
  };

  const deleteCandidate = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/candidates/${id}`, { method: 'DELETE' });
      if (res.ok) setCandidates(prev => prev.filter(c => c.id !== id));
    } catch(err) { console.error("Failed to delete candidate", err); }
  };

  const [moderators, setModerators] = useState([]);

  const addModerator = async (modData) => {
    try {
      const res = await fetch('http://localhost:5000/api/moderators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modData)
      });
      if (res.ok) {
        const newMod = await res.json();
        setModerators(prev => [...prev, newMod]);
      }
    } catch(err) { console.error(err); }
  };

  const updateModerator = (id, modData) => {
    setModerators(prev => prev.map(m => m.id === id ? { ...m, ...modData } : m));
  };

  const approveModerator = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/moderators/${id}/approve`, { method: 'PUT' });
      if (res.ok) {
        setModerators(prev => prev.map(m => m.id === id ? { ...m, isApproved: true } : m));
      }
    } catch (err) {
      console.error("Failed to approve moderator", err);
    }
  };

  const deleteModerator = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/moderators/${id}`, { method: 'DELETE' });
      if (res.ok) setModerators(prev => prev.filter(m => m.id !== id));
    } catch(err) { console.error(err); }
  };

  return (
    <ElectionContext.Provider value={{ 
      electionTitle, academicYear, status, updateElectionConfig, setStatus,
      totalVotes, totalEligible, candidates, trendData, demoData, recentActivity,
      positions, addPosition, updatePosition, deletePosition,
      addCandidate, updateCandidate, deleteCandidate,
      moderators, addModerator, updateModerator, approveModerator, deleteModerator,
      advancedSettings, updateAdvancedSettings,
      processCsvData, resetData, castBallot,
      isPublished, togglePublish
    }}>
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  return useContext(ElectionContext);
}
