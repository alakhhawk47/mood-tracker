import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CheckIn from "./pages/CheckIn";
import Analytics from "./pages/Analytics";
import Timeline from "./pages/Timeline";
import Onboarding from "./pages/Onboarding";
import useTheme from "./hooks/useTheme";

export default function App() {
  useTheme(); // Initialize theme globally
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const hasOnboarded = localStorage.getItem('onboarded') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen bg-wellness-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl flex items-center justify-center font-bold text-2xl text-deep-purple shadow-glass animate-float">
            E
          </div>
          <p className="text-slate-600 text-sm font-medium animate-pulse-soft">Loading EmoGraph...</p>
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

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" replace />}
          />
          <Route
            path="/check-in"
            element={user ? <CheckIn /> : <Navigate to="/" replace />}
          />
          <Route
            path="/timeline"
            element={user ? <Timeline /> : <Navigate to="/" replace />}
          />
          <Route
            path="/analytics"
            element={user ? <Analytics /> : <Navigate to="/" replace />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}