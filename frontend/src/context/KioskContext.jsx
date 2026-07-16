import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const KioskContext = createContext();

export function KioskProvider({ children }) {
  const [activeStudent, setActiveStudent] = useState(null); // The student enabled for voting
  const [kioskStatus, setKioskStatus] = useState('idle'); // 'idle', 'voting', 'completed'
  
  // Advanced Mod Features
  const [isLockdown, setIsLockdown] = useState(() => {
    const saved = localStorage.getItem('kioskLockdown');
    return saved ? JSON.parse(saved) : false;
  });
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('kioskAudit');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'system', desc: 'System Initialized', time: new Date().toISOString(), by: 'System' }
    ];
  });

  const logAction = (type, desc, by = 'System') => {
    setAuditLogs(prev => [{ id: Date.now(), type, desc, time: new Date().toISOString(), by }, ...prev]);
  };

  const toggleLockdown = () => {
    const newState = !isLockdown;
    setIsLockdown(newState);
    if (newState) {
      logAction('critical', 'EMERGENCY LOCKDOWN INITIATED', 'Moderator');
      cancelVoting(); // Force cancel any active session
    } else {
      logAction('info', 'Emergency Lockdown Lifted', 'Moderator');
    }
  };
  
  // Voting Booths Management
  const [booths, setBooths] = useState([]);
  
  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/booths');
        if (res.ok) setBooths(await res.json());
      } catch (err) {
        console.error("Failed to fetch booths:", err);
      }
    };
    fetchBooths();
  }, []);
  
  const expirationTimer = useRef(null);

  const [roster, setRoster] = useState([]);

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/students');
        if (res.ok) setRoster(await res.json());
      } catch (err) {
        console.error("Failed to fetch roster:", err);
      }
    };
    
    // Fetch immediately
    fetchRoster();
    
    // Poll every 3 seconds to keep roster synced across tabs
    const interval = setInterval(fetchRoster, 3000);
    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    localStorage.setItem('kioskAudit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      try {
        if (e.key === 'electionRoster' && e.newValue) setRoster(JSON.parse(e.newValue));
        if (e.key === 'kioskBooths' && e.newValue) setBooths(JSON.parse(e.newValue));
        if (e.key === 'kioskLockdown' && e.newValue) setIsLockdown(JSON.parse(e.newValue));
        if (e.key === 'kioskAudit' && e.newValue) setAuditLogs(JSON.parse(e.newValue));
      } catch(err) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addBooth = async (newBooth) => {
    try {
      const res = await fetch('http://localhost:5000/api/booths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooth)
      });
      if (res.ok) {
        const added = await res.json();
        setBooths([...booths, added]);
        logAction('info', `Added new terminal: ${added.name}`);
      }
    } catch(err) { console.error(err); }
  };

  const removeBooth = async (boothId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/booths/${boothId}`, { method: 'DELETE' });
      if (res.ok) {
        const booth = booths.find(b => b.id === boothId);
        setBooths(booths.filter(b => b.id !== boothId));
        logAction('warning', `Removed terminal: ${booth?.name}`);
      }
    } catch(err) { console.error(err); }
  };

  const updateBoothStatus = async (boothId, newStatus) => {
    if (isLockdown) return;
    try {
      const res = await fetch(`http://localhost:5000/api/booths/${boothId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const booth = booths.find(b => b.id === boothId);
        setBooths(booths.map(b => b.id === boothId ? { ...b, status: newStatus } : b));
        logAction('info', `Terminal ${booth?.name} status changed to ${newStatus}`, 'Moderator');
      }
    } catch(err) { console.error(err); }
  };

  const enableVoting = async (studentId, boothId) => {
    if (isLockdown) return null;
    try {
      await fetch(`http://localhost:5000/api/booths/${boothId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });
      logAction('security', `Authorized Voting Pass: ${studentId} for ${boothId}`, 'Moderator');
      // Update local state for immediate feedback
      setBooths(booths.map(b => b.id === boothId ? { ...b, status: 'voting', activeStudentSession: studentId } : b));
    } catch(err) { console.error(err); }
  };

  const cancelVoting = async (boothId) => {
    if (boothId) {
      try {
        await fetch(`http://localhost:5000/api/booths/${boothId}/session`, { method: 'DELETE' });
        logAction('warning', `Force-terminated active session at ${boothId}`, 'Moderator');
        setBooths(booths.map(b => b.id === boothId ? { ...b, status: 'idle', activeStudentSession: null } : b));
      } catch(err) { console.error(err); }
    }
    setActiveStudent(null);
    setKioskStatus('idle');
  };

  const generateCredentials = (studentIds = null) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let generatedCount = 0;
    
    setRoster(prev => prev.map(student => {
      if ((studentIds === null || studentIds.has(student.id)) && !student.credential) {
        let code = '';
        for(let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        generatedCount++;
        return { ...student, credential: code };
      }
      return student;
    }));
    
    if (generatedCount > 0) {
      logAction('info', `Generated ${generatedCount} new voter credentials.`, 'Admin');
    }
  };

  const authenticateVoter = async (boothId) => {
    if (isLockdown) return false;
    
    try {
      // Securely fetch booth session from backend instead of local storage
      const res = await fetch('http://localhost:5000/api/booths');
      if (res.ok) {
        const allBooths = await res.json();
        const thisBooth = allBooths.find(b => b.id === boothId);
        
        if (thisBooth && thisBooth.activeStudentSession) {
          setKioskStatus('voting');
          setActiveStudent(thisBooth.activeStudentSession);
          logAction('security', `Voter ${thisBooth.activeStudentSession} successfully authenticated at kiosk ${boothId}.`);
          return true;
        }
      }
    } catch(err) { console.error("Auth failed:", err); }
    
    return false;
  };

  const markVoted = (boothId = null) => {
    const boothName = boothId ? booths.find(b => b.id === boothId)?.name || boothId : 'kiosk';
    
    if (activeStudent) {
      setRoster(prev => prev.map(s => s.id === activeStudent ? { ...s, status: 'voted' } : s));
      logAction('success', `Voter ${activeStudent} successfully cast their ballot at ${boothName}.`);
    } else {
      logAction('success', `Anonymous ballot successfully cast at ${boothName}.`);
    }
    
    setActiveStudent(null);
    setKioskStatus('completed');
    
    if (boothId) {
      // Clear session securely from backend
      fetch(`http://localhost:5000/api/booths/${boothId}/session`, { method: 'DELETE' }).catch(console.error);
      setBooths(booths.map(b => b.id === boothId ? { ...b, status: 'idle', activeStudentSession: null } : b));
    }
    
    // Automatically reset kiosk to idle after 5 seconds
    setTimeout(() => {
      setKioskStatus('idle');
    }, 5000);
  };

  return (
    <KioskContext.Provider value={{
      activeStudent, kioskStatus, roster, booths, setRoster,
      isLockdown, toggleLockdown, auditLogs, logAction,
      enableVoting, cancelVoting, authenticateVoter, markVoted, setKioskStatus,
      addBooth, removeBooth, updateBoothStatus, generateCredentials
    }}>
      {children}
    </KioskContext.Provider>
  );
}

export const useKioskContext = () => useContext(KioskContext);
