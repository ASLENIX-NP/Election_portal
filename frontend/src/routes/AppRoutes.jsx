import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '@/layouts/AdminLayout';
import ModLayout from '@/layouts/ModLayout';
import VoteLayout from '@/layouts/VoteLayout';

// Pages
import AdminDashboard from '@/pages/admin/page';
import ManageCandidates from '@/pages/admin/candidates/page';
import ManageStudents from '@/pages/admin/students/page';
import ManageModerators from '@/pages/admin/moderators/page';
import AdminSettings from '@/pages/admin/settings/page';
import AdminLogin from '@/pages/admin/login/page';
import ManageBallot from '@/pages/admin/ballot/page';
import ManageBooths from '@/pages/admin/booths/page';

import ModDashboard from '@/pages/mod/page';
import VoteLogin from '@/pages/vote/page';
import BallotPage from '@/pages/vote/ballot/page';
import ReceiptPage from '@/pages/vote/receipt/page';
import LandingPage from '@/pages/LandingPage';
import VerifyPage from '@/pages/verify/page';

export default function AppRoutes() {
  return (
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
  );
}
