import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMoodByLabel, getMoodById } from '../utils/moodData';

export default function MoodHistory({ history, onEdit, onDelete }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <div className="text-5xl mb-4">🌱</div>
        <p className="font-medium text-slate-500">No mood entries yet</p>
        <p className="text-sm mt-1">Start tracking to see your history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {history.map((item, i) => {
          const mood = getMoodById(item.mood) || getMoodByLabel(item.mood);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16, scale: 0.95 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              className="flex items-center gap-4 bg-white/60 backdrop-blur-sm border border-white/70 rounded-2xl p-4 shadow-sm hover:shadow-card transition-shadow"
            >
              {/* Emoji */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${mood?.bgColor || 'bg-slate-100'}`}>
                {mood?.emoji || '😐'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-sm font-semibold ${mood?.textColor || 'text-slate-700'}`}>
                    {mood?.label || item.mood}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-400">{item.date}</span>
                </div>
                {item.note && (
                  <p className="text-xs text-slate-500 truncate">{item.note}</p>
                )}
                {item.influences?.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-1">
                    {item.influences.slice(0, 3).map((inf) => (
                      <span key={inf} className="text-xs bg-white/80 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                        {inf}
                      </span>
                    ))}
                    {item.influences.length > 3 && (
                      <span className="text-xs text-slate-400">+{item.influences.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Scale badge */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${mood?.bgColor || 'bg-slate-100'} ${mood?.textColor || 'text-slate-700'}`}>
                  {item.scale}
                </div>
                <span className="text-xs text-slate-400">/10</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-deep-purple hover:bg-soft-purple/10 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
