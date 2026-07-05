import { Outlet } from 'react-router-dom';

export default function ModLayout() {
  return (
    <div className="mod-layout">
      <header className="mod-header">
        <h2>Moderator Portal</h2>
      </header>
      <main className="mod-content">
        <Outlet />
      </main>
    </div>
  );
}
