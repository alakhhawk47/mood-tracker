import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMoodById } from '../utils/moodData';

const DEFAULT_AURA = {
  color: '#7C5CFC',
  glow: 'rgba(124,92,252,0.35)',
  highlight: 'rgba(255,255,255,0.6)',
  deep: '#5B3FD4',
  particle: '#A78BFA',
};

function getAuraStyle(mood) {
  if (!mood) return DEFAULT_AURA;
  const m = typeof mood === 'string' ? getMoodById(mood) : mood;
  if (!m) return DEFAULT_AURA;
  return {
    color: m.auraColor || DEFAULT_AURA.color,
    glow: m.auraGlow || DEFAULT_AURA.glow,
    highlight: 'rgba(255,255,255,0.5)',
    deep: m.auraColor ? `${m.auraColor}CC` : DEFAULT_AURA.deep,
    particle: m.particleColor || DEFAULT_AURA.particle,
  };
}

export default function MoodAuraOrb({ mood, size = 180, intensity = 5, className = '' }) {
  const aura = useMemo(() => getAuraStyle(mood), [mood]);

  // Intensity modulates size: 1=0.85x, 5=1x, 10=1.2x
  const intensityScale = 0.85 + (intensity / 10) * 0.35;
  const scaledSize = Math.round(size * intensityScale);
  const glowStrength = 15 + intensity * 4;

  const particles = useMemo(() => {
    return Array.from({ length: 6 + Math.floor(intensity * 0.4) }, (_, i) => ({
      id: i,
      size: 4 + Math.random() * 6,
      x: (Math.random() - 0.5) * scaledSize * 0.9,
      y: (Math.random() - 0.5) * scaledSize * 0.9,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 3,
    }));
  }, [scaledSize, intensity]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer glow ring */}
      <motion.div
        animate={{
          boxShadow: [
            `0 0 ${glowStrength * 2}px ${glowStrength}px ${aura.glow}`,
            `0 0 ${glowStrength * 3.5}px ${glowStrength * 1.6}px ${aura.glow}`,
            `0 0 ${glowStrength * 2}px ${glowStrength}px ${aura.glow}`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute rounded-full"
        style={{ width: scaledSize + 40, height: scaledSize + 40 }}
      />

      {/* Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.3],
              y: [0, -40 - Math.random() * 30],
              x: [p.x * 0.3, p.x],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              background: aura.particle,
              left: '50%',
              top: '50%',
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main orb */}
      <motion.div
        key={`${mood || 'default'}-${intensity}`}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="mood-orb animate-orb-float"
        style={{
          width: scaledSize,
          height: scaledSize,
          '--orb-color': aura.color,
          '--orb-glow': aura.glow,
          '--orb-highlight': aura.highlight,
          '--orb-deep': aura.deep,
          background: `radial-gradient(circle at 35% 35%, ${aura.highlight}, ${aura.color} 55%, ${aura.deep})`,
          boxShadow: `
            0 0 ${glowStrength * 2}px ${glowStrength}px ${aura.glow},
            inset 0 -12px 30px rgba(0,0,0,0.15),
            inset 0 10px 20px rgba(255,255,255,0.2)
          `,
        }}
      />

      {/* Mood label */}
      {mood && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute -bottom-8 font-mood text-lg dark:text-dark-text text-day-text"
        >
          {getMoodById(mood)?.label || ''}
        </motion.p>
      )}
    </div>
  );
}
