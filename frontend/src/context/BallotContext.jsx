import { createContext, useContext, useState } from 'react';

const BallotContext = createContext();

export function BallotProvider({ children }) {
  const [votes, setVotes] = useState({});
  const [receipt, setReceipt] = useState(null);

  const castVote = (position, candidateId) => {
    setVotes(prev => ({ ...prev, [position]: candidateId }));
  };

  return (
    <BallotContext.Provider value={{ votes, castVote, receipt, setReceipt }}>
      {children}
    </BallotContext.Provider>
  );
}

export function useBallotContext() {
  return useContext(BallotContext);
}
