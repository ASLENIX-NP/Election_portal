import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BallotProvider } from './context/BallotContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { KioskProvider } from './context/KioskContext';
import { ElectionProvider } from './context/ElectionContext';
import { Sun, Moon } from 'lucide-react';

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

// Layouts
import AdminLayout from './app/admin/layout';
import ModLayout from './app/mod/layout';
import VoteLayout from './app/vote/layout';

// Pages
import AdminDashboard from './app/admin/page';
import ManageCandidates from './app/admin/candidates/page';
import ManageStudents from './app/admin/students/page';
import ManageModerators from './app/admin/moderators/page';
import AdminSettings from './app/admin/settings/page';
import AdminLogin from './app/admin/login/page';
import ManageBallot from './app/admin/ballot/page';
import ManageBooths from './app/admin/booths/page';

import ModDashboard from './app/mod/page';
import VoteLogin from './app/vote/page';
import BallotPage from './app/vote/ballot/page';
import ReceiptPage from './app/vote/receipt/page';
import LandingPage from './app/page';
import VerifyPage from './app/verify/page';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BallotProvider>
          <KioskProvider>
            <ElectionProvider>
              <Router>
              <ThemeToggle />
              <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/verify" element={<VerifyPage />} />

                {/* Public Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="ballot" element={<ManageBallot />} />
                  <Route path="candidates" element={<ManageCandidates />} />
                  <Route path="students" element={<ManageStudents />} />
                  <Route path="moderators" element={<ManageModerators />} />
                  <Route path="booths" element={<ManageBooths />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Moderator Routes */}
                <Route path="/mod" element={<ModLayout />}>
                  <Route index element={<ModDashboard />} />
                </Route>

                {/* Voter Routes */}
                <Route path="/vote" element={<VoteLayout />}>
                  <Route index element={<VoteLogin />} />
                  <Route path="ballot" element={<BallotPage />} />
                  <Route path="receipt" element={<ReceiptPage />} />
                </Route>
              </Routes>
            </Router>
            </ElectionProvider>
          </KioskProvider>
        </BallotProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
