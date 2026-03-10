import React from 'react';
import { motion } from 'framer-motion';
import { auth } from '../firebase';
import { getTimeGreeting, getTimeEmoji } from '../utils/timeGreeting';

export default function Header({ latestMood, avgScore }) {
  const user = auth.currentUser;
  const firstName = user?.displayName?.split(' ')[0] || 'Friend';
  const greeting = getTimeGreeting();
  const timeEmoji = getTimeEmoji();

  const getScoreColor = () => {
    if (!avgScore || avgScore == 0) return 'text-slate-400';
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
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white/80"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-soft-purple to-deep-purple flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {firstName[0]}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-slate-500 font-medium">{greeting}</p>
          <h1 className="text-2xl font-bold text-slate-800">{firstName}</h1>
          <p className="text-xs text-slate-400 mt-0.5">How are you feeling today?</p>
        </div>
      </div>

      {/* Right: Score badge */}
      <div className="hidden sm:flex flex-col items-center bg-white/60 backdrop-blur-sm border border-white/70 rounded-2xl px-5 py-3 shadow-card">
        <p className="text-xs text-slate-400 font-medium mb-0.5">Mood Score</p>
        <p className={`text-2xl font-bold ${getScoreColor()}`}>
          {avgScore > 0 ? `${avgScore}` : '—'}
        </p>
        <p className="text-xs text-slate-400">/10</p>
      </div>
    </motion.div>
  );
}
