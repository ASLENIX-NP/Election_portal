import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { BallotProvider } from '@/context/BallotContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { KioskProvider } from '@/context/KioskContext';
import { ElectionProvider } from '@/context/ElectionContext';
import { Sun, Moon } from 'lucide-react';
import AppRoutes from '@/routes/AppRoutes';

import '@/App.css';

function ThemeToggle() {
  const { isLight, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme}
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', cursor: 'pointer', backdropFilter: 'blur(10px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
      title="Toggle Light/Dark Mode"
    >
      {isLight ? <Moon size={24} /> : <Sun size={24} />}
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BallotProvider>
          <KioskProvider>
            <ElectionProvider>
              <Router>
                <ThemeToggle />
                <AppRoutes />
              </Router>
            </ElectionProvider>
          </KioskProvider>
        </BallotProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
