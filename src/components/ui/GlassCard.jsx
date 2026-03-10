import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  delay = 0,
  hover = true,
  onClick,
  as: Tag = 'div',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, boxShadow: '0 16px 48px rgba(167, 139, 250, 0.22)' } : undefined}
      onClick={onClick}
      className={`
        bg-white/60 backdrop-blur-xl border border-white/70
        rounded-2xl shadow-card
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
