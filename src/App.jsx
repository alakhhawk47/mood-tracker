import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import EmailLogin from "./pages/EmailLogin";
import SignupPage from "./pages/SignupPage";
import TermsPage from "./pages/TermsPage";
import Dashboard from "./pages/Dashboard";
import CheckIn from "./pages/CheckIn";
import Analytics from "./pages/Analytics";
import Timeline from "./pages/Timeline";
import Onboarding from "./pages/Onboarding";
import Meditation from "./pages/Meditation";
import Breathing from "./pages/Breathing";
import Music from "./pages/Music";
import Constellation from "./pages/Constellation";
import Garden from "./pages/Garden";
import LucyChatbot from "./pages/LucyChatbot";
import useTheme from "./hooks/useTheme";

export default function App() {
  useTheme(); // Initialize theme globally
  const { user, loading } = useAuth();

  const hasOnboarded = localStorage.getItem('onboardingCompleted') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen bg-day-bg dark:bg-night-bg flex items-center justify-center transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl border border-white/50 dark:border-dark-border/40 rounded-3xl flex items-center justify-center font-heading font-bold text-2xl text-day-primary dark:text-night-primary shadow-glass animate-float">
            E
          </div>
          <p className="text-gray-500 dark:text-dark-muted text-sm font-body font-medium animate-pulse-soft">Loading EmoGraph...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Onboarding — shown to first-time users before login */}
          <Route
            path="/onboarding"
            element={!hasOnboarded ? <Onboarding /> : <Navigate to="/" replace />}
          />

          {/* Public — redirect to onboarding if first-time */}
          <Route
            path="/"
            element={
              !user
                ? !hasOnboarded
                  ? <Navigate to="/onboarding" replace />
                  : <Login />
                : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/login/email"
            element={user ? <Navigate to="/dashboard" replace /> : <EmailLogin />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />}
          />
          <Route 
            path="/terms" 
            element={<TermsPage />} 
          />

          {/* Protected routes */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
          <Route path="/check-in" element={user ? <CheckIn /> : <Navigate to="/" replace />} />
          <Route path="/timeline" element={user ? <Timeline /> : <Navigate to="/" replace />} />
          <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/" replace />} />
          <Route path="/meditation" element={user ? <Meditation /> : <Navigate to="/" replace />} />
          <Route path="/breathing" element={user ? <Breathing /> : <Navigate to="/" replace />} />
          <Route path="/music" element={user ? <Music /> : <Navigate to="/" replace />} />
          <Route path="/constellation" element={user ? <Constellation /> : <Navigate to="/" replace />} />
          <Route path="/garden" element={user ? <Garden /> : <Navigate to="/" replace />} />
          <Route path="/lucy" element={user ? <LucyChatbot /> : <Navigate to="/" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}