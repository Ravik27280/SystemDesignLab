import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProblemsPage } from './pages/ProblemsPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { PricingPage } from './pages/PricingPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfilePage } from './pages/ProfilePage';
import { ComingSoonPage } from './pages/ComingSoonPage';

// Placeholder pages
import { DesignsPage } from './pages/DesignsPage';

import { PracticeModePage } from './pages/PracticeModePage';

const LeaderboardPage = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Leaderboard</h2>
    <p className="text-[rgb(var(--color-text-secondary))] mt-2">See how you rank against others</p>
  </div>
);

const SettingsPage = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Settings</h2>
    <p className="text-[rgb(var(--color-text-secondary))] mt-2">Manage your account settings</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected app routes (with layout) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/designs" element={<DesignsPage />} />
          <Route path="/practice" element={<PracticeModePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
        </Route>

        {/* Workspace route - fullscreen without layout */}
        <Route path="/workspace/:problemId" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
