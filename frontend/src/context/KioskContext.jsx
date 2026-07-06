import React, { createContext, useContext, useState, useRef } from 'react';

const KioskContext = createContext();

export function KioskProvider({ children }) {
  const [activeStudent, setActiveStudent] = useState(null); // The student enabled for voting
  const [kioskStatus, setKioskStatus] = useState('idle'); // 'idle', 'voting', 'completed'
  
  const expirationTimer = useRef(null);

  const [roster, setRoster] = useState([
    { id: 'S-1001', name: 'Alice Adams', grade: '12th', status: 'eligible' },
    { id: 'S-1002', name: 'Bob Baker', grade: '11th', status: 'eligible' },
    { id: 'S-1003', name: 'Charlie Clark', grade: '12th', status: 'voted' },
    { id: 'S-1004', name: 'Diana Davis', grade: '10th', status: 'eligible' },
    { id: 'S-1005', name: 'Evan Evans', grade: '9th', status: 'eligible' },
  ]);

  const enableVoting = (studentId) => {
    setActiveStudent(studentId);
    setKioskStatus('idle'); // Ready for input at the kiosk
    
    // Clear any existing expiration timer
    if (expirationTimer.current) clearTimeout(expirationTimer.current);
    
    // Set 5-minute expiration (300,000 milliseconds)
    expirationTimer.current = setTimeout(() => {
      setActiveStudent(null);
      setKioskStatus('idle');
    }, 300000);
  };

  const cancelVoting = () => {
    if (expirationTimer.current) clearTimeout(expirationTimer.current);
    setActiveStudent(null);
    setKioskStatus('idle');
  };

  const authenticateVoter = (inputId) => {
    if (inputId && inputId === activeStudent) {
      // Voter has authenticated, stop the expiration timer
      if (expirationTimer.current) clearTimeout(expirationTimer.current);
      setKioskStatus('voting');
      return true;
    }
    return false;
  };

  const markVoted = () => {
    if (expirationTimer.current) clearTimeout(expirationTimer.current);
    if (activeStudent) {
      setRoster(prev => prev.map(s => s.id === activeStudent ? { ...s, status: 'voted' } : s));
    }
    setActiveStudent(null);
    setKioskStatus('completed');
    
    // Automatically reset kiosk to idle after 5 seconds
    setTimeout(() => {
      setKioskStatus('idle');
    }, 5000);
  };

  return (
    <KioskContext.Provider value={{
      activeStudent, kioskStatus, roster, 
      enableVoting, cancelVoting, authenticateVoter, markVoted, setKioskStatus
    }}>
      {children}
    </KioskContext.Provider>
  );
}

export const useKioskContext = () => useContext(KioskContext);
