import React from 'react';
import { motion } from 'framer-motion';

/* ─── Floating wrapper shared by every illustration ─── */
const Float = ({ children, delay = 0 }) => (
  <motion.div
    animate={{ y: [0, -12, 0] }}
    transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay }}
    className="relative flex items-center justify-center"
  >
    {children}
  </motion.div>
);

/* ─── Shared pulsing ring ─── */
const Ring = ({ size, borderColor, duration, reverse }) => (
  <motion.div
    animate={{ rotate: reverse ? -360 : 360, scale: [1, 1.04, 1] }}
    transition={{ rotate: { repeat: Infinity, duration, ease: 'linear' }, scale: { repeat: Infinity, duration: duration / 2, ease: 'easeInOut' } }}
    className="absolute rounded-full"
    style={{ width: size, height: size, border: `2px solid ${borderColor}` }}
  />
);

/* ─── Screen 1: Calm — concentric rings + lotus heart ─── */
function CalmIllustration() {
  return (
    <Float>
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-violet-300/20 dark:bg-violet-500/10 blur-2xl" />

        <Ring size={224} borderColor="rgba(255,255,255,0.18)" duration={22} />
        <Ring size={180} borderColor="rgba(255,255,255,0.14)" duration={16} reverse />
        <Ring size={136} borderColor="rgba(255,255,255,0.10)" duration={12} />

        {/* Center orb */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.15))',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(167,139,250,0.25)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          {/* Lotus SVG */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <motion.path
              d="M18 8C18 8 12 14 12 20C12 23.3 14.7 26 18 26C21.3 26 24 23.3 24 20C24 14 18 8 18 8Z"
              fill="rgba(255,255,255,0.7)"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            />
            <motion.path
              d="M18 12C18 12 8 16 8 22C8 25 10 27 13 27C15 27 17 25.5 18 24"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              animate={{ pathLength: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
            <motion.path
              d="M18 12C18 12 28 16 28 22C28 25 26 27 23 27C21 27 19 25.5 18 24"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              animate={{ pathLength: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.3 }}
            />
          </svg>
        </motion.div>

        {/* Orbiting particles */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/40"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8 + i * 2, ease: 'linear' }}
            style={{ top: '50%', left: '50%', transformOrigin: `${40 + i * 18}px 0px` }}
          />
        ))}
      </div>
    </Float>
  );
}

/* ─── Screen 2: Insights — chart + orbiting data points ─── */
function InsightsIllustration() {
  return (
    <Float delay={0.3}>
      <div className="relative w-56 h-56 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-sky-300/20 dark:bg-sky-500/10 blur-2xl" />

        <Ring size={224} borderColor="rgba(255,255,255,0.14)" duration={18} />
        <Ring size={180} borderColor="rgba(255,255,255,0.10)" duration={14} reverse />

        {/* Center card */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.15))',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(56,189,248,0.2)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          {/* Mini chart SVG */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <motion.polyline
              points="4,32 12,22 20,26 28,14 36,18"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              animate={{ pathLength: [0, 1], opacity: [0.5, 1] }}
              transition={{ duration: 2, ease: 'easeOut', repeat: Infinity, repeatDelay: 2 }}
            />
            {/* Data dots */}
            {[[12, 22], [20, 26], [28, 14]].map(([cx, cy], i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r="3"
                fill="rgba(255,255,255,0.9)"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.5 + i * 0.3, duration: 0.5, repeat: Infinity, repeatDelay: 3.5 }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Floating emoji badges */}
        {['😊', '😌', '💡'].map((emoji, i) => (
          <motion.div
            key={emoji}
            className="absolute w-10 h-10 rounded-2xl bg-white/25 dark:bg-white/10 backdrop-blur-sm border border-white/40 flex items-center justify-center text-lg shadow-lg"
            animate={{
              y: [0, -8, 0],
              rotate: [0, i % 2 === 0 ? 5 : -5, 0],
            }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut', delay: i * 0.4 }}
            style={{
              top: i === 0 ? '8%' : i === 1 ? '70%' : '20%',
              left: i === 0 ? '10%' : i === 1 ? '5%' : '78%',
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </Float>
  );
}

/* ─── Screen 3: Habits — growing seedling with rings ─── */
function HabitsIllustration() {
  return (
    <Float delay={0.5}>
      <div className="relative w-56 h-56 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-pink-300/20 dark:bg-pink-500/10 blur-2xl" />

        {/* Expanding rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/15"
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeOut', delay: i * 1 }}
            style={{ width: 100, height: 100 }}
          />
        ))}

        <Ring size={224} borderColor="rgba(255,255,255,0.12)" duration={20} />

        {/* Center glow */}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.15))',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(244,114,182,0.2)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          {/* Plant SVG */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            {/* Stem */}
            <motion.path
              d="M20 36V18"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ pathLength: [0, 1] }}
              transition={{ duration: 1.5, ease: 'easeOut', repeat: Infinity, repeatDelay: 3 }}
            />
            {/* Left leaf */}
            <motion.path
              d="M20 24C20 24 12 22 10 16C14 16 18 18 20 24Z"
              fill="rgba(255,255,255,0.6)"
              animate={{ scale: [0.8, 1, 0.8], rotate: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ transformOrigin: '20px 24px' }}
            />
            {/* Right leaf */}
            <motion.path
              d="M20 20C20 20 28 18 30 12C26 12 22 14 20 20Z"
              fill="rgba(255,255,255,0.6)"
              animate={{ scale: [0.8, 1, 0.8], rotate: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.5 }}
              style={{ transformOrigin: '20px 20px' }}
            />
            {/* Top bloom */}
            <motion.circle
              cx="20"
              cy="14"
              r="6"
              fill="rgba(255,255,255,0.5)"
              animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="20"
              cy="14"
              r="3"
              fill="rgba(255,255,255,0.8)"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>

        {/* Sparkle particles */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/50"
            animate={{
              y: [0, -30 - i * 10],
              x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 5)],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5 + i * 0.3,
              ease: 'easeOut',
              delay: i * 0.6,
            }}
            style={{
              bottom: '35%',
              left: `${44 + i * 3}%`,
            }}
          />
        ))}
      </div>
    </Float>
  );
}

/* ─── Public API ─── */
const illustrations = {
  calm: CalmIllustration,
  insights: InsightsIllustration,
  habits: HabitsIllustration,
};

export default function OnboardingIllustration({ variant = 'calm' }) {
  const Component = illustrations[variant] || CalmIllustration;
  return (
    <div className="mb-8">
      <Component />
    </div>
  );
}
