import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  delay = 0,
  hover = true,
  onClick,
  moodTint,
}) {
  const tintMap = {
    happy:   'rgba(251,191,36,0.06)',
    calm:    'rgba(52,211,153,0.06)',
    sad:     'rgba(96,165,250,0.06)',
    angry:   'rgba(248,113,113,0.06)',
    tired:   'rgba(167,139,250,0.06)',
    excited: 'rgba(244,114,182,0.06)',
    anxious: 'rgba(139,92,246,0.06)',
  };

  const tintBg = moodTint && tintMap[moodTint] ? tintMap[moodTint] : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, boxShadow: '0 16px 48px rgba(124, 92, 252, 0.18)' } : undefined}
      onClick={onClick}
      className={`
        bg-white/55 dark:bg-dark-card/55 backdrop-blur-2xl
        border border-white/50 dark:border-dark-border/40
        rounded-2xl shadow-card dark:shadow-none
        dark:glass-glow
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={tintBg ? { backgroundColor: tintBg } : undefined}
    >
      {children}
    </motion.div>
  );
}
