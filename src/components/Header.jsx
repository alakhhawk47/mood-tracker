import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getTimeGreeting, getTimeEmoji } from '../utils/timeGreeting';
import ThemeToggle from './ThemeToggle';

export default function Header({ latestMood, avgScore }) {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Friend';
  const greeting = getTimeGreeting();

  const getScoreColor = () => {
    if (!avgScore || avgScore == 0) return 'text-gray-400 dark:text-dark-muted';
    if (avgScore >= 7) return 'text-emerald-500';
    if (avgScore >= 5) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex items-center justify-between mb-8"
    >
      {/* Left: Greeting */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={firstName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white/60 dark:border-dark-border/40"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-day-primary to-day-secondary flex items-center justify-center text-white text-2xl font-heading font-bold shadow-md">
              {firstName[0]}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-dark-muted font-body font-medium">{greeting}</p>
          <h1 className="text-2xl font-heading font-bold text-day-text dark:text-dark-text">{firstName}</h1>
          <p className="text-xs text-gray-400 dark:text-dark-muted mt-0.5 font-body">How are you feeling today?</p>
        </div>
      </div>

      {/* Right: Score badge & Theme Toggle */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="hidden sm:flex flex-col items-center bg-white/50 dark:bg-dark-card/50 backdrop-blur-xl border border-white/50 dark:border-dark-border/40 rounded-2xl px-5 py-3 shadow-card dark:shadow-none transition-colors duration-300">
          <p className="text-xs text-gray-400 dark:text-dark-muted font-body font-medium mb-0.5">Mood Score</p>
          <p className={`text-2xl font-heading font-bold ${getScoreColor()}`}>
            {avgScore > 0 ? `${avgScore}` : '—'}
          </p>
          <p className="text-xs text-gray-400 dark:text-dark-muted font-body">/10</p>
        </div>
      </div>
    </motion.div>
  );
}
