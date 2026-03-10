import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MoodAnalytics from '../components/MoodAnalytics';
import MoodHistory from '../components/MoodHistory';
import InsightCard from '../components/InsightCard';
import GradientBlob from '../components/ui/GradientBlob';
import { useMoodHistory } from '../hooks/useMoodHistory';

const SUGGESTIONS_MAP = {
  happy: 'Keep it up! Share your positivity with someone today.',
  calm: 'Great state. Try journaling to deepen your clarity.',
  sad: 'Be gentle with yourself. A short walk or breathing exercise can help.',
  angry: 'Take deep breaths. A 5-minute meditation can release tension.',
  tired: 'Rest is productive. Prioritize sleep tonight.',
  excited: 'Channel that energy! Set a small goal you can finish today.',
};

export default function Analytics() {
  const navigate = useNavigate();
  const {
    history,
    avgScore,
    trend,
    weeklyData,
    pieData,
    deleteEntry,
    streak,
    positivePct,
    suggestion,
    latestMood,
  } = useMoodHistory();

  const insightCards = [
    {
      icon: (
        <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
      title: 'Mood Streak',
      value: streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : '0 days',
      description: streak >= 2
        ? `You logged moods for ${streak} days in a row. Keep it going!`
        : 'Log your mood today to start a streak.',
      gradient: 'from-orange-50 to-amber-100',
      accent: 'bg-orange-100',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Weekly Summary',
      value: positivePct !== null ? `${positivePct}% positive` : 'No data',
      description: positivePct !== null
        ? positivePct >= 60
          ? `You felt positive ${positivePct}% of the week. Great week!`
          : `${positivePct}% positive days this week. Small steps help.`
        : 'Log moods this week to see your summary.',
      gradient: 'from-violet-50 to-purple-100',
      accent: 'bg-violet-100',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Suggestion',
      value: latestMood
        ? latestMood.charAt(0).toUpperCase() + latestMood.slice(1)
        : 'Start logging',
      description: suggestion,
      gradient: 'from-emerald-50 to-teal-100',
      accent: 'bg-emerald-100',
    },
  ];

  return (
    <div className="min-h-screen bg-wellness-gradient relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <GradientBlob className="w-72 h-72 bg-pastel-blue top-[-3rem] right-[-3rem]" />
        <GradientBlob className="w-80 h-80 bg-lavender bottom-[6rem] left-[-4rem]" style={{ animationDelay: '4s' }} />
      </div>

      <Sidebar />

      <div className="lg:pl-64 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-slate-800">Mood Analytics</h1>
            <p className="text-slate-500 text-sm mt-1">Explore your emotional patterns over time</p>
          </motion.div>

          {/* Insight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {insightCards.map((card, i) => (
              <InsightCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                value={card.value}
                description={card.description}
                gradient={card.gradient}
                accent={card.accent}
                delay={i * 0.1}
              />
            ))}
          </div>

          {/* Analytics Charts */}
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-card p-12 text-center mb-8"
            >
              <h3 className="font-bold text-slate-600 text-lg mb-2">No data yet</h3>
              <p className="text-slate-400 text-sm mb-5">Start logging your moods to see beautiful analytics here</p>
              <button
                onClick={() => navigate('/check-in')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-soft-purple to-deep-purple text-white text-sm font-semibold shadow-mood hover:shadow-glass transition-all"
              >
                Log your first mood →
              </button>
            </motion.div>
          ) : (
            <MoodAnalytics
              weeklyData={weeklyData}
              pieData={pieData}
              avgScore={avgScore}
              totalLogs={history.length}
              trend={trend}
            />
          )}

          {/* Mood History */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-700 text-base">
                Mood History
                {history.length > 0 && (
                  <span className="ml-2 text-xs text-slate-400 font-normal">
                    ({history.length} {history.length === 1 ? 'entry' : 'entries'})
                  </span>
                )}
              </h2>
              {history.length > 0 && (
                <button
                  onClick={() => navigate('/check-in')}
                  className="text-xs text-soft-purple font-semibold hover:text-deep-purple transition-colors"
                >
                  + Add entry
                </button>
              )}
            </div>

            <MoodHistory
              history={history}
              onDelete={deleteEntry}
              onEdit={() => navigate('/check-in')}
            />
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-xs text-slate-400 mt-10"
          >
            Built by Alakh Raj Singh
          </motion.p>
        </div>
      </div>
    </div>
  );
}
