import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/ui/GlassCard';
import GradientBlob from '../components/ui/GradientBlob';

const GUIDED_SESSIONS = [
  { id: 1, title: 'Morning Calm', duration: 300, description: 'Start your day with peaceful clarity', emoji: '🌅', gradient: 'from-amber-100 to-orange-50' },
  { id: 2, title: 'Focus Flow', duration: 600, description: 'Sharpen your mind for deep work', emoji: '🎯', gradient: 'from-blue-100 to-indigo-50' },
  { id: 3, title: 'Stress Relief', duration: 900, description: 'Let go of tension and worry', emoji: '🍃', gradient: 'from-green-100 to-teal-50' },
  { id: 4, title: 'Sleep Prep', duration: 600, description: 'Wind down for a restful night', emoji: '🌙', gradient: 'from-purple-100 to-violet-50' },
  { id: 5, title: 'Body Scan', duration: 900, description: 'Tune in to your body sensations', emoji: '🧘', gradient: 'from-pink-100 to-rose-50' },
  { id: 6, title: 'Gratitude', duration: 300, description: 'Cultivate appreciation and joy', emoji: '💛', gradient: 'from-yellow-100 to-amber-50' },
];

const STORAGE_KEY = 'meditationHistory';

function getHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function Meditation() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [history, setHistory] = useState(getHistory);
  const intervalRef = useRef(null);

  const streak = (() => {
    const dates = [...new Set(history.map(h => h.date))].sort((a, b) => new Date(b) - new Date(a));
    let count = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);
    for (const dateStr of dates) {
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      const diff = Math.round((current - d) / 86400000);
      if (diff <= 1) { count++; current = d; } else break;
    }
    return count;
  })();

  const totalMinutes = Math.round(history.reduce((s, h) => s + h.duration, 0) / 60);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setCompleted(true);
      const entry = { date: new Date().toLocaleDateString(), duration: selectedSession.duration, title: selectedSession.title, timestamp: Date.now() };
      const updated = [entry, ...history];
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }, [timeLeft]);

  const startSession = (session) => {
    setSelectedSession(session);
    setTimeLeft(session.duration);
    setIsRunning(false);
    setCompleted(false);
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetSession = () => {
    clearInterval(intervalRef.current);
    setSelectedSession(null);
    setIsRunning(false);
    setCompleted(false);
    setTimeLeft(0);
  };

  const progress = selectedSession ? 1 - timeLeft / selectedSession.duration : 0;
  const circumference = 2 * Math.PI * 90;

  return (
    <div className="min-h-screen bg-day-bg dark:bg-night-bg relative overflow-x-hidden transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-50 dark:opacity-15">
        <GradientBlob className="w-80 h-80 bg-day-primary/20 top-[-4rem] right-[-4rem]" />
        <GradientBlob className="w-72 h-72 bg-day-accent/20 bottom-[8rem] left-[-3rem]" style={{ animationDelay: '4s' }} />
      </div>

      <Sidebar />

      <div className="lg:pl-64 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-heading font-bold text-day-text dark:text-dark-text">Meditation</h1>
            <p className="text-gray-500 dark:text-dark-muted text-sm font-body mt-1">Find your inner peace</p>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <GlassCard className="p-4 text-center" delay={0.1}>
              <p className="text-2xl font-heading font-bold text-day-primary dark:text-night-primary">{streak}</p>
              <p className="text-xs text-gray-400 dark:text-dark-muted font-body mt-1">Day Streak</p>
            </GlassCard>
            <GlassCard className="p-4 text-center" delay={0.15}>
              <p className="text-2xl font-heading font-bold text-day-accent dark:text-night-accent">{history.length}</p>
              <p className="text-xs text-gray-400 dark:text-dark-muted font-body mt-1">Sessions</p>
            </GlassCard>
            <GlassCard className="p-4 text-center" delay={0.2}>
              <p className="text-2xl font-heading font-bold text-day-secondary dark:text-night-secondary">{totalMinutes}</p>
              <p className="text-xs text-gray-400 dark:text-dark-muted font-body mt-1">Total Min</p>
            </GlassCard>
          </div>

          <AnimatePresence mode="wait">
            {selectedSession ? (
              <motion.div key="timer" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <GlassCard className="p-8 flex flex-col items-center" hover={false}>
                  <h2 className="font-heading font-bold text-lg text-day-text dark:text-dark-text mb-2">{selectedSession.title}</h2>
                  <p className="text-sm text-gray-400 dark:text-dark-muted font-body mb-6">{selectedSession.description}</p>

                  {/* Circular progress */}
                  <div className="relative w-52 h-52 mb-8">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200 dark:text-dark-border" />
                      <motion.circle
                        cx="100" cy="100" r="90"
                        stroke="url(#timerGrad)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset: circumference * (1 - progress) }}
                        transition={{ duration: 0.5, ease: 'linear' }}
                      />
                      <defs>
                        <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7C5CFC" />
                          <stop offset="100%" stopColor="#36D6B5" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {completed ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                          <span className="text-4xl">🧘</span>
                          <p className="text-sm font-heading font-bold text-emerald-500 mt-2">Complete!</p>
                        </motion.div>
                      ) : (
                        <>
                          <p className="text-4xl font-heading font-bold text-day-text dark:text-dark-text">{formatTime(timeLeft)}</p>
                          <p className="text-xs text-gray-400 dark:text-dark-muted font-body mt-1">
                            {isRunning ? 'Meditating...' : 'Paused'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {!completed && (
                      <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={toggleTimer}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-day-primary to-day-accent text-white font-heading font-bold text-sm shadow-mood"
                      >
                        {isRunning ? 'Pause' : 'Start'}
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={resetSession}
                      className="px-6 py-3 rounded-xl bg-white/50 dark:bg-dark-card/50 border border-white/40 dark:border-dark-border/30 text-gray-600 dark:text-dark-muted font-body font-medium text-sm"
                    >
                      Back
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div key="sessions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-heading font-bold text-day-text dark:text-dark-text text-base mb-4">Guided Sessions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {GUIDED_SESSIONS.map((session, i) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(124,92,252,0.12)' }}
                      onClick={() => startSession(session)}
                      className={`bg-gradient-to-br ${session.gradient} dark:bg-dark-card/40 dark:from-dark-card/60 dark:to-dark-card/30 rounded-2xl p-5 border border-white/40 dark:border-dark-border/30 cursor-pointer transition-all`}
                    >
                      <span className="text-3xl mb-3 block">{session.emoji}</span>
                      <h3 className="font-heading font-bold text-day-text dark:text-dark-text text-sm mb-1">{session.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-dark-muted font-body mb-3">{session.description}</p>
                      <span className="text-xs text-day-primary dark:text-night-primary font-body font-semibold">{formatTime(session.duration)}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Session history */}
                {history.length > 0 && (
                  <>
                    <h2 className="font-heading font-bold text-day-text dark:text-dark-text text-base mb-4">Recent Sessions</h2>
                    <GlassCard className="p-4 divide-y divide-gray-100 dark:divide-dark-border/30" hover={false}>
                      {history.slice(0, 5).map((h, i) => (
                        <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                          <div>
                            <p className="text-sm font-heading font-semibold text-day-text dark:text-dark-text">{h.title}</p>
                            <p className="text-xs text-gray-400 dark:text-dark-muted font-body">{h.date}</p>
                          </div>
                          <span className="text-xs text-day-primary dark:text-night-primary font-body font-semibold">{formatTime(h.duration)}</span>
                        </div>
                      ))}
                    </GlassCard>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
