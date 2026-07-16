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
import AdminSignup from '@/pages/admin/signup/page';
import AdminForgotPassword from '@/pages/admin/forgot-password/page';
import AdminResetPassword from '@/pages/admin/reset-password/page';
import ManageBallot from '@/pages/admin/ballot/page';
import ManageBooths from '@/pages/admin/booths/page';
import AdminAuditLedger from '@/pages/admin/audit/page';

import ModDashboard from '@/pages/mod/page';
import ModVerifyPage from '@/pages/mod/verify/page';
import ModBoothsPage from '@/pages/mod/booths/page';
import ModAuditLogs from '@/pages/mod/audit/page';
import ModResetPage from '@/pages/mod/reset/page';
import ModLogin from '@/pages/mod/login/page';
import ModSignup from '@/pages/mod/signup/page';
import ModForgotPassword from '@/pages/mod/forgot-password/page';
import ModResetPassword from '@/pages/mod/reset-password/page';

import VoteLogin from '@/pages/vote/page';
import BallotPage from '@/pages/vote/ballot/page';
import ReceiptPage from '@/pages/vote/receipt/page';
import LandingPage from '@/pages/LandingPage';
import VoterLogin from '@/pages/voter/login/page';
import VerifyPage from '@/pages/verify/page';
import PublicPortal from '@/pages/portal/page';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/voter/login" element={<VoterLogin />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/portal" element={<PublicPortal />} />

      {/* Public Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="ballot" element={<ManageBallot />} />
        <Route path="candidates" element={<Navigate to="/admin/ballot" replace />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="moderators" element={<ManageModerators />} />
        <Route path="booths" element={<ManageBooths />} />
        <Route path="audit" element={<AdminAuditLedger />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Moderator Routes */}
      <Route path="/mod/login" element={<ModLogin />} />
      <Route path="/mod/signup" element={<ModSignup />} />
      <Route path="/mod/forgot-password" element={<ModForgotPassword />} />
      <Route path="/mod/reset-password/:token" element={<ModResetPassword />} />
      <Route path="/mod" element={<ModLayout />}>
        <Route index element={<ModDashboard />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="verify" element={<ModVerifyPage />} />
        <Route path="booths" element={<ModBoothsPage />} />
        <Route path="audit" element={<ModAuditLogs />} />
        <Route path="reset" element={<ModResetPage />} />
      </Route>

      {/* Voter Routes */}
      <Route path="/vote" element={<Navigate to="/" replace />} />
      <Route path="/vote/:boothId" element={<VoteLayout />}>
        <Route index element={<VoteLogin />} />
        <Route path="ballot" element={<BallotPage />} />
        <Route path="receipt" element={<ReceiptPage />} />
      </Route>
    </Routes>
  );
}
