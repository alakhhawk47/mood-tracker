import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MoodAuraOrb from '../components/MoodAuraOrb';
import ActivityCard from '../components/ActivityCard';
import GlassCard from '../components/ui/GlassCard';
import GradientBlob from '../components/ui/GradientBlob';
import { useMoodHistory } from '../hooks/useMoodHistory';
import { ACTIVITIES, MOODS, getMoodById } from '../utils/moodData';
import { FiMessageSquare, FiTrendingUp, FiSun } from 'react-icons/fi';

export default function Dashboard() {
  const navigate = useNavigate();
  const { history, avgScore, latestMood, trend, weeklyData, pieData, streak, positivePct } = useMoodHistory();
  const [hoveredMood, setHoveredMood] = useState(null);
  const activeMood = hoveredMood || latestMood;
  const latestMoodObj = latestMood ? getMoodById(latestMood) : null;

  const QUICK_MOODS = [
    { id: 'happy', emoji: '😄', label: 'Happy' },
    { id: 'calm', emoji: '😌', label: 'Calm' },
    { id: 'sad', emoji: '😢', label: 'Sad' },
    { id: 'angry', emoji: '😤', label: 'Angry' },
    { id: 'anxious', emoji: '😰', label: 'Anxious' },
    { id: 'excited', emoji: '🤩', label: 'Excited' },
  ];

  const chartData = weeklyData.map((d) => ({
    ...d,
    score: d.score !== null ? parseFloat(d.score.toFixed(1)) : null,
  }));

  return (
    <div className="min-h-screen bg-day-bg dark:bg-night-bg relative overflow-x-hidden transition-colors duration-500">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-60 dark:opacity-20 transition-opacity duration-500">
        <GradientBlob className="w-96 h-96 bg-day-primary/30 top-[-6rem] right-[-6rem]" />
        <GradientBlob className="w-80 h-80 bg-day-accent/20 bottom-[10rem] left-[-4rem]" style={{ animationDelay: '3s' }} />
        <GradientBlob className="w-64 h-64 bg-day-secondary/20 top-[40%] right-[20%]" style={{ animationDelay: '5s' }} />
      </div>

      <Sidebar />

      {/* Main content */}
      <div className="lg:pl-64 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">

          {/* Header */}
          <Header avgScore={avgScore} latestMood={latestMood} />

          {/* ═══════════════ ZONE 1 — Mood Input & Orb ═══════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Mood Selection */}
            <GlassCard className="p-6" delay={0.2} moodTint={activeMood}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-heading font-bold text-day-text dark:text-dark-text text-lg">How are you feeling?</h2>
                  <p className="text-gray-400 dark:text-dark-muted text-sm font-body mt-1">Select to see your mood aura</p>
                </div>
                <button
                  onClick={() => navigate('/check-in')}
                  className="text-xs text-day-primary dark:text-night-primary font-semibold font-body hover:opacity-80 transition-opacity"
                >
                  Full check-in →
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {QUICK_MOODS.map((m, i) => (
                  <motion.button
                    key={m.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.35, ease: 'backOut' }}
                    whileHover={{ scale: 1.12, y: -3 }}
                    whileTap={{ scale: 0.92 }}
                    onMouseEnter={() => setHoveredMood(m.id)}
                    onMouseLeave={() => setHoveredMood(null)}
                    onClick={() => navigate('/check-in')}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-300 ${
                      activeMood === m.id
                        ? 'bg-day-primary/10 dark:bg-night-primary/15 border-day-primary/30 dark:border-night-primary/30 shadow-sm'
                        : 'bg-white/40 dark:bg-dark-card/40 border-white/40 dark:border-dark-border/30 hover:bg-white/60 dark:hover:bg-dark-card/60'
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className={`text-[10px] font-mood font-medium ${
                      activeMood === m.id ? 'text-day-primary dark:text-night-primary' : 'text-gray-500 dark:text-dark-muted'
                    }`}>{m.label}</span>
                  </motion.button>
                ))}
              </div>
            </GlassCard>

            {/* Mood Aura Orb */}
            <GlassCard className="p-6 flex flex-col items-center justify-center min-h-[250px]" delay={0.3} hover={false} moodTint={activeMood}>
              <MoodAuraOrb mood={activeMood} size={160} intensity={history.length > 0 ? Math.round(history[0]?.scale || 5) : 5} />
              {!activeMood && (
                <p className="text-xs text-gray-400 dark:text-dark-muted font-body mt-10">Hover or select a mood to see your aura</p>
              )}
            </GlassCard>
          </div>

          {/* Today's Mood Snapshot */}
          {latestMoodObj && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-xl border border-white/40 dark:border-dark-border/30 rounded-2xl p-4 mb-8 flex items-center gap-4 shadow-card dark:shadow-none transition-colors duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${latestMoodObj.bgColor} flex items-center justify-center text-2xl shadow-sm`}>
                {latestMoodObj.emoji}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 dark:text-dark-muted font-body">Last logged mood</p>
                <p className={`font-heading font-bold text-base ${latestMoodObj.textColor} dark:text-dark-text`}>{latestMoodObj.label}</p>
              </div>
              <button
                onClick={() => navigate('/check-in')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-day-primary to-day-secondary text-white text-xs font-semibold font-body shadow-sm hover:shadow-mood transition-all"
              >
                Update
              </button>
            </motion.div>
          )}

          {/* ═══════════════ ZONE 2 — Visualization ═══════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Weekly Mood Trend */}
            <GlassCard className="p-6" delay={0.4}>
              <h3 className="font-heading font-bold text-day-text dark:text-dark-text text-sm mb-4">Mood Terrain</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="terrainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.5} />
                      <stop offset="40%" stopColor="#36D6B5" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#FAF7F2" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="terrainStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7C5CFC" />
                      <stop offset="100%" stopColor="#36D6B5" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,92,252,0.06)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', borderRadius: '12px', border: 'none', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontFamily: 'DM Sans' }} />
                  <Area
                    type="natural"
                    dataKey="score"
                    stroke="url(#terrainStroke)"
                    strokeWidth={2.5}
                    fill="url(#terrainGrad)"
                    dot={{ fill: '#7C5CFC', r: 3.5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#7C5CFC', stroke: '#fff', strokeWidth: 2 }}
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Mood Distribution */}
            <GlassCard className="p-6" delay={0.45}>
              <h3 className="font-heading font-bold text-day-text dark:text-dark-text text-sm mb-4">Mood Distribution</h3>
              {pieData.length > 0 ? (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={160}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                        {pieData.map((entry, index) => {
                          const moodItem = MOODS.find((m) => m.label === entry.name || m.id === entry.name);
                          return <Cell key={`cell-${index}`} fill={moodItem?.chartColor || '#A78BFA'} />;
                        })}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2">
                    {pieData.slice(0, 5).map((entry) => {
                      const moodItem = MOODS.find((m) => m.label === entry.name || m.id === entry.name);
                      return (
                        <div key={entry.name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: moodItem?.chartColor || '#A78BFA' }} />
                          <span className="text-xs text-gray-500 dark:text-dark-muted font-body">{entry.name}</span>
                          <span className="text-xs text-gray-400 dark:text-dark-muted ml-auto font-body">{entry.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 dark:text-dark-muted font-body text-center py-8">Log moods to see distribution</p>
              )}
            </GlassCard>
          </div>

          {/* ═══════════════ ZONE 3 — Supporting Widgets ═══════════════ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Streak */}
            <GlassCard className="p-5 text-center" delay={0.5}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="text-lg">⭐</span>
              </div>
              <p className="text-2xl font-heading font-bold text-amber-500">{streak}</p>
              <p className="text-xs text-gray-400 dark:text-dark-muted font-body mt-1">Golden Streak</p>
            </GlassCard>

            {/* Mood Percentage */}
            <GlassCard className="p-5 text-center" delay={0.55}>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">💚</span>
              </div>
              <p className="text-2xl font-heading font-bold text-emerald-500">{positivePct !== null ? `${positivePct}%` : '—'}</p>
              <p className="text-xs text-gray-400 dark:text-dark-muted font-body mt-1">Positive this week</p>
            </GlassCard>

            {/* Total Logs */}
            <GlassCard className="p-5 text-center" delay={0.6}>
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">📊</span>
              </div>
              <p className="text-2xl font-heading font-bold text-day-primary dark:text-night-primary">{history.length}</p>
              <p className="text-xs text-gray-400 dark:text-dark-muted font-body mt-1">Total Logs</p>
            </GlassCard>

            {/* Avg Score */}
            <GlassCard className="p-5 text-center" delay={0.65}>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">✨</span>
              </div>
              <p className={`text-2xl font-heading font-bold ${avgScore >= 7 ? 'text-emerald-500' : avgScore >= 5 ? 'text-amber-500' : 'text-rose-400'}`}>
                {avgScore > 0 ? avgScore : '—'}
              </p>
              <p className="text-xs text-gray-400 dark:text-dark-muted font-body mt-1">Avg Score</p>
            </GlassCard>
          </div>

          {/* Activities */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-day-text dark:text-dark-text text-base">Today's Activities</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ACTIVITIES.map((activity, i) => (
                <ActivityCard key={activity.id} activity={activity} index={i} />
              ))}
            </div>
          </div>

          {/* ═══════════════ ZONE 3 — AI & Insights ═══════════════ */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-day-text dark:text-dark-text text-base">Personal Insights</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Talk to Lucy */}
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(124,92,252,0.12)' }}
                onClick={() => navigate('/lucy')}
                className="bg-gradient-to-br from-day-primary/10 via-day-accent/5 to-white dark:from-night-primary/20 dark:via-night-accent/10 dark:to-dark-card/60 backdrop-blur-xl rounded-2xl p-5 border border-day-primary/20 dark:border-night-primary/30 cursor-pointer overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-day-accent/20 dark:bg-night-accent/20 rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-day-primary to-day-accent flex items-center justify-center text-white shadow-mood">
                    <FiMessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-day-text dark:text-dark-text text-sm">Talk to Lucy</h3>
                    <p className="text-[10px] text-day-primary dark:text-night-primary font-bold tracking-wide uppercase">AI Companion</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-dark-muted font-body relative z-10">
                  {latestMoodObj?.positive === false 
                    ? "It looks like you're having a tough time. I'm here to listen if you want to talk." 
                    : "I'm here to support your mental wellness journey. How's your day going?"}
                </p>
              </motion.div>

              {/* Weekly Trend Insight */}
              <GlassCard className="p-5" hover={true}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center">
                    <FiTrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-day-text dark:text-dark-text text-sm">Trend</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-dark-muted font-body">
                  {trend === 'improving' 
                    ? "Your mood is trending up this week! Keep noticing what brings you joy."
                    : trend === 'declining'
                    ? "Your mood has dipped recently. Be gentle with yourself and prioritize rest."
                    : "Your mood is steady. Consistent routines are building a strong foundation."}
                </p>
              </GlassCard>

              {/* General Wellness Insight */}
              <GlassCard className="p-5" hover={true}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
                    <FiSun className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-day-text dark:text-dark-text text-sm">Wellness Idea</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-dark-muted font-body">
                  {latestMood === 'anxious' || latestMood === 'stress'
                    ? "Try a quick 5-minute breathing exercise to reset your nervous system."
                    : latestMood === 'sad' || latestMood === 'tired'
                    ? "A short walk in nature or 10 minutes of sunlight can naturally boost serotonin."
                    : "Journaling positive moments helps train your brain to notice the good."}
                </p>
              </GlassCard>

            </div>
          </div>

          {/* Quick Journal Entry */}
          <GlassCard className="p-6 mb-8" delay={0.75}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-day-primary/20 to-day-accent/20 dark:from-night-primary/20 dark:to-night-accent/20 flex items-center justify-center">
                <span className="text-sm">✍️</span>
              </div>
              <h3 className="font-heading font-bold text-day-text dark:text-dark-text text-sm">Quick Journal</h3>
            </div>
            <div
              onClick={() => navigate('/check-in')}
              className="w-full bg-white/40 dark:bg-dark-card/30 border border-white/30 dark:border-dark-border/20 rounded-xl px-4 py-3 text-sm text-gray-400 dark:text-dark-muted font-body cursor-pointer hover:border-day-primary/30 dark:hover:border-night-primary/30 transition-colors"
            >
              How are you feeling right now? Tap to log...
            </div>
          </GlassCard>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 dark:text-dark-muted font-body mt-8">
            Built by Alakh Raj Singh
          </p>
        </div>
      </div>
    </div>
  );
}