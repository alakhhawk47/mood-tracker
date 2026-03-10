import React from 'react';
import { motion } from 'framer-motion';

export default function InsightCard({ icon, title, value, description, gradient, delay = 0, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(167,139,250,0.2)' }}
      className={`relative overflow-hidden rounded-2xl p-5 border border-white/70 shadow-card bg-gradient-to-br ${gradient}`}
    >
      {/* Decorative shimmer blob */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/25 blur-xl" />

      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${accent} shadow-sm`}>
        {icon}
      </div>

      {/* Content */}
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-800 leading-tight mb-1">{value}</p>
      {description && (
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}
