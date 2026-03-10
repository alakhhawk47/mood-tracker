import React from 'react';
import { motion } from 'framer-motion';
import { MOODS } from '../utils/moodData';

export default function MoodSelector({ selectedMood, onSelect }) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {MOODS.map((mood, i) => {
          const isSelected = selectedMood === mood.id;
          return (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: 'backOut' }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelect(mood.id)}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-2xl
                border-2 transition-all duration-300
                ${isSelected
                  ? `bg-gradient-to-br ${mood.color} ${mood.border} ${mood.glow}`
                  : 'bg-white/60 border-white/60 hover:border-purple-200 backdrop-blur-sm'
                }
              `}
            >
              {/* Glow ring on selected */}
              {isSelected && (
                <motion.div
                  layoutId="mood-ring"
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mood.color} opacity-30`}
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              )}

              <span className="text-3xl relative z-10" role="img" aria-label={mood.label}>
                {mood.emoji}
              </span>
              <span
                className={`text-xs font-semibold relative z-10 ${
                  isSelected ? mood.textColor : 'text-slate-500'
                }`}
              >
                {mood.label}
              </span>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                    mood.bgColor
                  } border-2 border-white flex items-center justify-center`}
                >
                  <div className={`w-2 h-2 rounded-full ${mood.textColor.replace('text', 'bg')}`} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
