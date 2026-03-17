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
        relative aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-body font-medium
        transition-all duration-200 cursor-pointer
        ${isSelected
          ? mood
            ? `bg-gradient-to-br ${mood.color} shadow-mood border-2 border-white/60`
            : 'bg-day-primary/15 border-2 border-day-primary/30'
          : mood
          ? `bg-gradient-to-br ${mood.color} opacity-80 hover:opacity-100`
          : 'bg-white/30 dark:bg-dark-card/30 hover:bg-white/60 dark:hover:bg-dark-card/50 border border-white/30 dark:border-dark-border/20'
        }
        ${isToday && !mood ? 'border-2 border-day-primary/50' : ''}
      `}
    >
      <span className={`text-xs font-heading font-semibold leading-none mb-0.5 ${mood ? 'text-gray-700' : isToday ? 'text-day-primary dark:text-night-primary' : 'text-gray-400 dark:text-dark-muted'}`}>
        {date.getDate()}
      </span>

      {mood && (
        <span className="text-base leading-none">{mood.emoji}</span>
      )}

      {isToday && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-day-primary dark:bg-night-primary" />
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
      className="mt-4 rounded-2xl p-5 border border-white/40 dark:border-dark-border/30 shadow-card-hover bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${mood?.bgColor || 'bg-gray-100 dark:bg-dark-card'} flex items-center justify-center text-xl`}>
            {mood?.emoji || '😐'}
          </div>
          <div>
            <p className={`font-heading font-bold text-sm ${mood?.textColor || 'text-gray-700'} dark:text-dark-text`}>{mood?.label || entry.mood}</p>
            <p className="text-xs text-gray-400 dark:text-dark-muted font-body">{entry.date} · Intensity: {entry.scale}/10</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-card-hover flex items-center justify-center text-gray-500 dark:text-dark-muted text-xs transition-colors"
        >
          ✕
        </button>
      </div>

      {entry.note && (
        <p className="text-sm text-gray-600 dark:text-dark-muted font-body bg-white/40 dark:bg-dark-card/40 rounded-xl px-3 py-2 mb-3 italic">
          "{entry.note}"
        </p>
      )}

      {entry.influences?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.influences.map((inf) => (
            <span key={inf} className="text-xs bg-white/60 dark:bg-dark-card/60 border border-white/40 dark:border-dark-border/30 text-gray-500 dark:text-dark-muted font-body px-2.5 py-1 rounded-full">
              {inf}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
