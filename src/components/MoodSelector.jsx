import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOODS } from '../utils/moodData';

export default function MoodSelector({ selectedMood, onSelect }) {
  const [ripple, setRipple] = useState(null);
  const containerRef = useRef(null);

  const handleSelect = (mood, e) => {
    // Create ripple at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const color = mood.auraColor || '#7C5CFC';

    setRipple({ x, y, color, id: Date.now() });
    setTimeout(() => setRipple(null), 700);

    onSelect(mood.id);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* Ripple effect */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50"
            style={{
              left: ripple.x - 30,
              top: ripple.y - 30,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${ripple.color}40 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
        {MOODS.map((mood, i) => {
          const isSelected = selectedMood === mood.id;
          return (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: 'backOut' }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => handleSelect(mood, e)}
              className={`
                relative flex flex-col items-center gap-2 p-3 rounded-2xl overflow-hidden
                border-2 transition-all duration-300
                ${isSelected
                  ? `bg-gradient-to-br ${mood.color} ${mood.border} ${mood.glow}`
                  : 'bg-white/50 dark:bg-dark-card/40 border-white/40 dark:border-dark-border/30 hover:border-day-primary/30 dark:hover:border-night-primary/30 backdrop-blur-sm'
                }
              `}
            >
              {/* Selection glow ring */}
              {isSelected && (
                <motion.div
                  layoutId="mood-ring"
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mood.color} opacity-20`}
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              )}

              <motion.span
                className="text-3xl relative z-10"
                role="img"
                aria-label={mood.label}
                animate={isSelected ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                {mood.emoji}
              </motion.span>
              <span
                className={`text-xs font-mood font-medium relative z-10 ${
                  isSelected ? mood.textColor : 'text-gray-500 dark:text-dark-muted'
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
                  } border-2 border-white dark:border-dark-card flex items-center justify-center z-10`}
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
