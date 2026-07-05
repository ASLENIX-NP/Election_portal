import { useState, useEffect } from 'react';
import api from '../services/api';

export function useElection() {
  const [status, setStatus] = useState('loading'); // loading, active, closed
  
  useEffect(() => {
    // Fetch live election status stub
    setStatus('active');
  }, []);

  return { status };
}
