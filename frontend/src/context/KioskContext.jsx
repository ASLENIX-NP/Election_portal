import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const KioskContext = createContext();

export function KioskProvider({ children }) {
  const [activeStudent, setActiveStudent] = useState(null); // The student enabled for voting
  const [kioskStatus, setKioskStatus] = useState('idle'); // 'idle', 'voting', 'completed'
  
  // Advanced Mod Features
  const [isLockdown, setIsLockdown] = useState(false);
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, type: 'system', desc: 'System Initialized', time: new Date().toISOString(), by: 'System' }
  ]);

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
  const [booths, setBooths] = useState([
    { id: 'booth-01', name: 'Terminal Alpha', location: 'Main Hall', status: 'idle' },
    { id: 'booth-02', name: 'Terminal Beta', location: 'Main Hall', status: 'offline' },
    { id: 'booth-03', name: 'Terminal Gamma', location: 'Annex Hall', status: 'idle' },
    { id: 'booth-04', name: 'Terminal Delta', location: 'Annex Hall', status: 'offline' }
  ]);
  
  const expirationTimer = useRef(null);

  const mockRoster = [];
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const grades = ['9th', '10th', '11th', '12th'];
  
  for(let i=1001; i<=1050; i++) {
    mockRoster.push({
      id: `PASS-${i}`,
      name: `${firstNames[i%firstNames.length]} ${lastNames[i%lastNames.length]}`,
      grade: grades[i%grades.length],
      status: 'eligible'
    });
  }

  const getInitialRoster = () => {
    const stored = localStorage.getItem('electionRoster');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { }
    }
    return mockRoster;
  };

  const [roster, setRoster] = useState(getInitialRoster);

  useEffect(() => {
    localStorage.setItem('electionRoster', JSON.stringify(roster));
  }, [roster]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'electionRoster' && e.newValue) {
        try {
          setRoster(JSON.parse(e.newValue));
        } catch(err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addBooth = (newBooth) => {
    setBooths([...booths, { ...newBooth, id: `booth-${Date.now()}`, status: 'offline' }]);
    logAction('info', `Added new terminal: ${newBooth.name}`);
  };

  const removeBooth = (boothId) => {
    const booth = booths.find(b => b.id === boothId);
    setBooths(booths.filter(b => b.id !== boothId));
    logAction('warning', `Removed terminal: ${booth?.name}`);
  };

  const updateBoothStatus = (boothId, newStatus) => {
    if (isLockdown) return; // Prevent status changes during lockdown
    const booth = booths.find(b => b.id === boothId);
    setBooths(booths.map(b => b.id === boothId ? { ...b, status: newStatus } : b));
    logAction('info', `Terminal ${booth?.name} status changed to ${newStatus}`, 'Moderator');
  };

  const enableVoting = (studentId, boothId) => {
    if (isLockdown) return null;
    
    // Persist to localStorage for the specific booth
    localStorage.setItem(`activeStudent_${boothId}`, studentId);
    
    logAction('security', `Authorized Voting Pass: ${studentId} for ${boothId}`, 'Moderator');
  };

  const cancelVoting = (boothId) => {
    if (boothId) {
       localStorage.removeItem(`activeStudent_${boothId}`);
       logAction('warning', `Force-terminated active session at ${boothId}`, 'Moderator');
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

  const authenticateVoter = (boothId) => {
    if (isLockdown) return false;
    
    // Read from localStorage specific to this booth
    const currentStudent = localStorage.getItem(`activeStudent_${boothId}`);

    if (currentStudent) {
      setKioskStatus('voting');
      setActiveStudent(currentStudent); // Sync local state
      
      logAction('security', `Voter ${currentStudent} successfully authenticated at kiosk ${boothId}.`);
      return true;
    }
    
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
      localStorage.removeItem(`activeStudent_${boothId}`);
      updateBoothStatus(boothId, 'idle');
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
