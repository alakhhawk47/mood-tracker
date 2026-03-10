import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMoodById, getMoodByLabel } from '../utils/moodData';

export default function CalendarCell({ date, entry, isSelected, onClick, isToday }) {
  const mood = entry ? (getMoodById(entry.mood) || getMoodByLabel(entry.mood)) : null;

  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`
        relative aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-medium
        transition-all duration-200 cursor-pointer
        ${isSelected
          ? mood
            ? `bg-gradient-to-br ${mood.color} shadow-mood border-2 border-white/80`
            : 'bg-soft-purple/20 border-2 border-soft-purple/40'
          : mood
          ? `bg-gradient-to-br ${mood.color} opacity-80 hover:opacity-100`
          : 'bg-white/40 hover:bg-white/70 border border-white/50'
        }
        ${isToday && !mood ? 'border-2 border-soft-purple/60' : ''}
      `}
    >
      {/* Date number */}
      <span className={`text-xs font-semibold leading-none mb-0.5 ${mood ? 'text-slate-700' : isToday ? 'text-deep-purple' : 'text-slate-400'}`}>
        {date.getDate()}
      </span>

      {/* Mood emoji */}
      {mood && (
        <span className="text-base leading-none">{mood.emoji}</span>
      )}

      {/* Today dot */}
      {isToday && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-deep-purple" />
      )}
    </motion.button>
  );
}

export function CalendarDayDetail({ entry, onClose }) {
  const mood = entry ? (getMoodById(entry.mood) || getMoodByLabel(entry.mood)) : null;
  if (!entry) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className={`mt-4 rounded-2xl p-5 border border-white/70 shadow-card-hover bg-white/70 backdrop-blur-xl`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${mood?.bgColor || 'bg-slate-100'} flex items-center justify-center text-xl`}>
            {mood?.emoji || '😐'}
          </div>
          <div>
            <p className={`font-bold text-sm ${mood?.textColor || 'text-slate-700'}`}>{mood?.label || entry.mood}</p>
            <p className="text-xs text-slate-400">{entry.date} · Intensity: {entry.scale}/10</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition-colors"
        >
          ✕
        </button>
      </div>

      {entry.note && (
        <p className="text-sm text-slate-600 bg-white/60 rounded-xl px-3 py-2 mb-3 italic">
          "{entry.note}"
        </p>
      )}

      {entry.influences?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.influences.map((inf) => (
            <span key={inf} className="text-xs bg-white/80 border border-slate-200 text-slate-500 px-2.5 py-1 rounded-full">
              {inf}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
