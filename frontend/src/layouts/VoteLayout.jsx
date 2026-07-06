import { Outlet } from 'react-router-dom';

export default function VoteLayout() {
  return (
    <div className="vote-layout">
      {/* Minimal layout for voters, no navigation */}
      <main className="vote-content">
        <Outlet />
      </main>
    </div>
  );
}
