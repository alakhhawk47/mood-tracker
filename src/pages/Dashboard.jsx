import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MoodSelector from '../components/MoodSelector';
import ActivityCard from '../components/ActivityCard';
import GradientBlob from '../components/ui/GradientBlob';
import GlassCard from '../components/ui/GlassCard';
import { useMoodHistory } from '../hooks/useMoodHistory';
import { ACTIVITIES, getMoodById } from '../utils/moodData';
import { getMotivationalQuote } from '../utils/timeGreeting';

export default function Dashboard() {
  const navigate = useNavigate();
  const { history, avgScore, latestMood, trend } = useMoodHistory();
  const latestMoodObj = latestMood ? getMoodById(latestMood) : null;

  return (
    <div className="min-h-screen bg-wellness-gradient dark:bg-dark-wellness-gradient relative overflow-x-hidden transition-colors duration-300">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-100 dark:opacity-30 transition-opacity duration-300">
        <GradientBlob className="w-96 h-96 bg-soft-purple top-[-6rem] right-[-6rem]" />
        <GradientBlob className="w-80 h-80 bg-pastel-blue bottom-[10rem] left-[-4rem]" style={{ animationDelay: '3s' }} />
        <GradientBlob className="w-64 h-64 bg-soft-pink top-[40%] right-[20%]" style={{ animationDelay: '5s' }} />
      </div>

      <Sidebar />

      {/* Main content */}
      <div className="lg:pl-64 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">

          {/* Header */}
          <Header avgScore={avgScore} latestMood={latestMood} />



          {/* Today's Mood Snapshot (if any) */}
          {latestMoodObj && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl border border-white/70 dark:border-dark-border/50 rounded-2xl p-4 mb-8 flex items-center gap-4 shadow-card dark:shadow-none"
            >
              <div className={`w-12 h-12 rounded-xl ${latestMoodObj.bgColor} flex items-center justify-center text-2xl shadow-sm`}>
                {latestMoodObj.emoji}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 dark:text-dark-muted font-medium">Last logged mood</p>
                <p className={`font-bold text-base ${latestMoodObj.textColor} dark:text-dark-text`}>{latestMoodObj.label}</p>
              </div>
              <button
                onClick={() => navigate('/check-in')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-soft-purple to-deep-purple text-white text-xs font-semibold shadow-sm hover:shadow-mood transition-all"
              >
                Update
              </button>
            </motion.div>
          )}

          {/* How are you feeling? */}
          <GlassCard className="p-6 mb-8" delay={0.3}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-700 dark:text-dark-text text-base">How are you feeling?</h2>
              <button
                onClick={() => navigate('/check-in')}
                className="text-xs text-soft-purple dark:text-dark-accent font-semibold hover:text-deep-purple dark:hover:text-soft-purple transition-colors"
              >
                Full check-in →
              </button>
            </div>
            <QuickMoodRow />
          </GlassCard>

          {/* Activities */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-700 dark:text-dark-text text-base">Today's Activities</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ACTIVITIES.map((activity, i) => (
                <ActivityCard key={activity.id} activity={activity} index={i} />
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <GlassCard className="p-6 mb-8" delay={0.4}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-700 dark:text-dark-text text-base">Your Progress</h2>
              <button
                onClick={() => navigate('/analytics')}
                className="text-xs text-soft-purple dark:text-dark-accent font-semibold hover:text-deep-purple dark:hover:text-soft-purple transition-colors"
              >
                Full analytics →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Logs', value: history.length, color: 'text-fuchsia-600 dark:text-fuchsia-400' },
                { label: 'Avg Score', value: avgScore > 0 ? avgScore : '—', color: avgScore >= 7 ? 'text-emerald-500' : avgScore >= 5 ? 'text-amber-500' : 'text-rose-400' },
                { label: 'Today', value: history.filter(h => h.date === new Date().toLocaleDateString()).length || '—', color: 'text-sky-500' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-400 dark:text-dark-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
}

// Quick mood selector inside dashboard (navigates to check-in with selection)
function QuickMoodRow() {
  const navigate = useNavigate();
  const QUICK_MOODS = [
    { id: 'happy', emoji: '😄', label: 'Happy' },
    { id: 'calm', emoji: '😌', label: 'Calm' },
    { id: 'sad', emoji: '😢', label: 'Sad' },
    { id: 'angry', emoji: '😤', label: 'Angry' },
    { id: 'tired', emoji: '😴', label: 'Tired' },
    { id: 'excited', emoji: '🤩', label: 'Excited' },
  ];

  return (
    <div className="grid grid-cols-6 gap-2">
      {QUICK_MOODS.map((m, i) => (
        <motion.button
          key={m.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.06, duration: 0.38, ease: 'backOut' }}
          whileHover={{ scale: 1.12, y: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate('/check-in')}
          className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/50 hover:bg-white/80 dark:bg-dark-card/50 dark:hover:bg-dark-card/80 border border-white/60 dark:border-dark-border/50 transition-all"
        >
          <span className="text-2xl">{m.emoji}</span>
          <span className="text-xs text-slate-500 dark:text-dark-muted font-medium hidden sm:block">{m.label}</span>
        </motion.button>
      ))}
    </div>
  );
}