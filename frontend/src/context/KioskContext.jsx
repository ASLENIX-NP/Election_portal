import React, { createContext, useContext, useState, useRef } from 'react';

const KioskContext = createContext();

export function KioskProvider({ children }) {
  const [activeStudent, setActiveStudent] = useState(null); // The student enabled for voting
  const [activePasscode, setActivePasscode] = useState(null); // The one-time 6-digit code
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
      status: i % 3 === 0 ? 'voted' : 'eligible' // 33% voted
    });
  }

  const [roster, setRoster] = useState(mockRoster);

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

  const enableVoting = (studentId) => {
    if (isLockdown) return null;
    
    // Generate a random 6-character alphanumeric code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for(let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setActiveStudent(studentId);
    setActivePasscode(code);
    
    // Persist to localStorage for multi-tab support
    localStorage.setItem('activeStudent', studentId);
    localStorage.setItem('activePasscode', code);
    
    setKioskStatus('idle'); // Ready for input at the kiosk
    logAction('security', `Authorized Voting Pass: ${studentId} and generated access code.`, 'Moderator');
    
    // Clear any existing expiration timer
    if (expirationTimer.current) clearTimeout(expirationTimer.current);
    
    // Set 5-minute expiration (300,000 milliseconds)
    expirationTimer.current = setTimeout(() => {
      logAction('warning', `Voting session for ${studentId} expired due to timeout.`);
      setActiveStudent(null);
      setActivePasscode(null);
      localStorage.removeItem('activeStudent');
      localStorage.removeItem('activePasscode');
      setKioskStatus('idle');
    }, 300000);
    
    return code;
  };

  const cancelVoting = () => {
    if (expirationTimer.current) clearTimeout(expirationTimer.current);
    if (activeStudent) logAction('warning', `Force-terminated active session for ${activeStudent}`, 'Moderator');
    setActiveStudent(null);
    setActivePasscode(null);
    localStorage.removeItem('activeStudent');
    localStorage.removeItem('activePasscode');
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

  const authenticateVoter = (inputCode) => {
    if (isLockdown) return false;
    
    // Read from localStorage to support multi-tab testing
    const currentPasscode = localStorage.getItem('activePasscode') || activePasscode;
    const currentStudent = localStorage.getItem('activeStudent') || activeStudent;

    if (inputCode && currentPasscode && inputCode.toUpperCase() === currentPasscode) {
      // Voter has authenticated, stop the expiration timer
      if (expirationTimer.current) clearTimeout(expirationTimer.current);
      
      setKioskStatus('voting');
      setActivePasscode(null);
      setActiveStudent(currentStudent); // Sync local state
      
      // Destroy the one-time code
      localStorage.removeItem('activePasscode');
      
      logAction('security', `Voter ${currentStudent} successfully authenticated at kiosk with code.`);
      return true;
    }
    
    // Check pre-generated credentials
    if (inputCode) {
      const student = roster.find(s => s.credential && s.credential.toUpperCase() === inputCode.toUpperCase());
      if (student && student.status !== 'voted') {
        setKioskStatus('voting');
        setActiveStudent(student.id);
        logAction('security', `Voter ${student.id} successfully authenticated at kiosk with pre-generated credential.`);
        return true;
      }
    }
    return false;
  };

  const markVoted = (boothId = null) => {
    if (expirationTimer.current) clearTimeout(expirationTimer.current);
    const boothName = boothId ? booths.find(b => b.id === boothId)?.name || boothId : 'kiosk';
    
    if (activeStudent) {
      setRoster(prev => prev.map(s => s.id === activeStudent ? { ...s, status: 'voted' } : s));
      logAction('success', `Voter ${activeStudent} successfully cast their ballot at ${boothName}.`);
    } else {
      logAction('success', `Anonymous ballot successfully cast at ${boothName}.`);
    }
    
    setActiveStudent(null);
    setKioskStatus('completed');
    
    if (boothId) updateBoothStatus(boothId, 'idle');
    
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
