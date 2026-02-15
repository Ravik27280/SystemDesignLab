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

// Placeholder pages
const DesignsPage = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">My Designs</h2>
    <p className="text-[rgb(var(--color-text-secondary))] mt-2">Your saved designs will appear here</p>
  </div>
);

const PracticeModePage = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Practice Mode</h2>
    <p className="text-[rgb(var(--color-text-secondary))] mt-2">Timed practice sessions coming soon</p>
  </div>
);

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
