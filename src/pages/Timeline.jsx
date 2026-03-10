import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import GradientBlob from '../components/ui/GradientBlob';
import CalendarCell, { CalendarDayDetail } from '../components/CalendarCell';
import { useMoodHistory } from '../hooks/useMoodHistory';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MOOD_LEGEND = [
  { label: 'Happy', color: 'from-yellow-200 to-amber-300' },
  { label: 'Calm', color: 'from-green-200 to-teal-300' },
  { label: 'Sad', color: 'from-blue-200 to-indigo-300' },
  { label: 'Angry', color: 'from-red-200 to-rose-300' },
  { label: 'Tired', color: 'from-purple-200 to-violet-300' },
  { label: 'Excited', color: 'from-pink-200 to-fuchsia-300' },
];

export default function Timeline() {
  const navigate = useNavigate();
  const { getCalendarMonth } = useMoodHistory();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const calendarData = getCalendarMonth(viewYear, viewMonth);
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null);
    setSelectedEntry(null);
  };

  const handleNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDate(null);
    setSelectedEntry(null);
  };

  const handleCellClick = (dateObj, entry) => {
    if (selectedDate?.toDateString() === dateObj.toDateString()) {
      setSelectedDate(null);
      setSelectedEntry(null);
    } else {
      setSelectedDate(dateObj);
      setSelectedEntry(entry);
    }
  };

  // Build grid cells: leading blanks + day cells
  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    const key = date.toLocaleDateString();
    cells.push({ date, entry: calendarData[key] || null });
  }

  return (
    <div className="min-h-screen bg-wellness-gradient relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <GradientBlob className="w-96 h-96 bg-pastel-blue top-[-5rem] left-[-5rem]" />
        <GradientBlob className="w-72 h-72 bg-soft-pink bottom-[8rem] right-[-3rem]" style={{ animationDelay: '3s' }} />
      </div>

      <Sidebar />

      <div className="lg:pl-64 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-slate-800">Mood Timeline</h1>
            <p className="text-slate-500 text-sm mt-1">Your emotional journey, day by day</p>
          </motion.div>

          {/* Calendar Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-card p-5 mb-5"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-xl bg-white/70 hover:bg-white border border-white/70 flex items-center justify-center text-slate-600 hover:text-deep-purple transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h2 className="text-base font-bold text-slate-700">{monthName}</h2>

              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-xl bg-white/70 hover:bg-white border border-white/70 flex items-center justify-center text-slate-600 hover:text-deep-purple transition-all shadow-sm"
                disabled={viewYear === today.getFullYear() && viewMonth === today.getMonth()}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((cell, i) => {
                if (!cell) return <div key={`blank-${i}`} />;
                const isToday = cell.date.toDateString() === today.toDateString();
                const isSelected = selectedDate?.toDateString() === cell.date.toDateString();
                return (
                  <CalendarCell
                    key={cell.date.toDateString()}
                    date={cell.date}
                    entry={cell.entry}
                    isSelected={isSelected}
                    isToday={isToday}
                    onClick={() => handleCellClick(cell.date, cell.entry)}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Day detail expand */}
          <AnimatePresence>
            {selectedDate && (
              selectedEntry ? (
                <CalendarDayDetail
                  key="detail"
                  entry={selectedEntry}
                  onClose={() => { setSelectedDate(null); setSelectedEntry(null); }}
                />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-5 flex items-center justify-between shadow-card"
                >
                  <div>
                    <p className="font-semibold text-slate-600 text-sm">
                      {selectedDate.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">No mood logged for this day</p>
                  </div>
                  <button
                    onClick={() => navigate('/check-in')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-soft-purple to-deep-purple text-white text-xs font-semibold shadow-mood hover:shadow-glass transition-all flex-shrink-0"
                  >
                    Log mood
                  </button>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-4"
          >
            <p className="text-xs font-semibold text-slate-500 mb-3">Mood Color Legend</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {MOOD_LEGEND.map((m) => (
                <div key={m.label} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded-md bg-gradient-to-br ${m.color} flex-shrink-0`} />
                  <span className="text-xs text-slate-500">{m.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA if empty month */}
          {Object.values(calendarData).every((v) => !v) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl p-8 shadow-card"
            >
              <p className="text-slate-500 font-medium mb-1">No entries this month</p>
              <p className="text-slate-400 text-sm mb-4">Start logging daily to build your mood history</p>
              <button
                onClick={() => navigate('/check-in')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-soft-purple to-deep-purple text-white text-sm font-semibold shadow-mood hover:shadow-glass transition-all"
              >
                Log today's mood
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
