/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./lib/LanguageContext";
import OfflineBanner from "./components/common/OfflineBanner";

// Public Pages
import HomePage from "./pages/public/HomePage";
import AccessPage from "./pages/public/AccessPage";
import AcademyPage from "./pages/public/AcademyPage";
import TrainingPage from "./pages/public/TrainingPage";
import PositionsPage from "./pages/public/PositionsPage";
import AthleticismPage from "./pages/public/AthleticismPage";
import NutritionPage from "./pages/public/NutritionPage";
import MindsetPage from "./pages/public/MindsetPage";
import ShowcasePage from "./pages/public/ShowcasePage";
import TeamsPage from "./pages/public/TeamsPage";
import ScholarshipsPage from "./pages/public/ScholarshipsPage";
import AboutPage from "./pages/public/AboutPage";

// Role-Based Dashboards
import PlayerDashboard from "./pages/player/PlayerDashboard";
import CoachDashboard from "./pages/coach/CoachDashboard";
import ScoutDashboard from "./pages/scout/ScoutDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProviderDashboard from "./pages/provider/ProviderDashboard";

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <OfflineBanner />
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/access" element={<AccessPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/athleticism" element={<AthleticismPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/mindset" element={<MindsetPage />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Authenticated Role Dashboards */}
          <Route path="/player/*" element={<PlayerDashboard />} />
          <Route path="/coach/*" element={<CoachDashboard />} />
          <Route path="/scout/*" element={<ScoutDashboard />} />
          <Route path="/provider/*" element={<ProviderDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
