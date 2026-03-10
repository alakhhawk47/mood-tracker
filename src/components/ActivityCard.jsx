import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ACTIVITY_ICONS = {
  breathing: (
    <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  journal: (
    <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  meditation: (
    <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

export default function ActivityCard({ activity, index }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
      whileHover={{
        y: -6,
        rotateX: 3,
        rotateY: -3,
        boxShadow: '0 20px 48px rgba(167, 139, 250, 0.22)',
      }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`
        relative overflow-hidden rounded-2xl p-5
        bg-gradient-to-br ${activity.gradient} dark:opacity-90
        border border-white/70 dark:border-dark-border/50 shadow-card dark:shadow-none
        cursor-pointer group
      `}
    >
      {/* Floating shimmer top-right */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/30 dark:bg-white/10 blur-2xl" />

      {/* Duration badge */}
      <div className="absolute top-3 right-3 bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium text-slate-600 dark:text-dark-muted">
        {activity.duration}
      </div>

      <div className={`${activity.iconBg} w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
        {ACTIVITY_ICONS[activity.iconId]}
      </div>

      <h3 className="font-bold text-slate-800 dark:text-dark-text text-base mb-1">{activity.title}</h3>
      <p className="text-slate-500 dark:text-dark-muted text-xs mb-4 leading-relaxed">{activity.description}</p>

      <button
        onClick={() => navigate('/check-in')}
        className="
          flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold
          bg-white/70 hover:bg-white dark:bg-dark-card/70 dark:hover:bg-dark-card dark:text-dark-text text-slate-700
          transition-all duration-200 group-hover:shadow-md dark:group-hover:shadow-none
        "
      >
        Start
        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </motion.div>
  );
}
