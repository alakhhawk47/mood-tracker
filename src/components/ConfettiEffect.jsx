import React, { useEffect, useState } from 'react';
import { getMoodById } from '../utils/moodData';

const CONFETTI_COLORS = ['#FBBF24', '#34D399', '#7C5CFC', '#FF9A76', '#F472B6', '#60A5FA', '#A78BFA'];

function randomBetween(a, b) {
  return Math.random() * (b - a) + a;
}

export default function ConfettiEffect({ mood, trigger }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const moodObj = typeof mood === 'string' ? getMoodById(mood) : mood;
    const isPositive = moodObj?.positive !== false && moodObj?.score >= 6;

    const newParticles = [];
    const count = isPositive ? 40 : 25;

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `${Date.now()}-${i}`,
        type: isPositive ? 'confetti' : 'rain',
        left: randomBetween(10, 90),
        delay: randomBetween(0, 0.8),
        duration: isPositive ? randomBetween(2, 3.5) : randomBetween(1.2, 2.2),
        size: isPositive ? randomBetween(6, 12) : randomBetween(1.5, 3),
        color: isPositive
          ? CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
          : `rgba(96, 165, 250, ${randomBetween(0.3, 0.6)})`,
        rotation: randomBetween(0, 360),
      });
    }

    setParticles(newParticles);

    const timeout = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timeout);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {particles.map((p) => (
        <div
          key={p.id}
          className={p.type === 'confetti' ? 'confetti-particle' : 'rain-particle'}
          style={{
            left: `${p.left}%`,
            top: p.type === 'confetti' ? '-10px' : `${randomBetween(-5, 10)}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundColor: p.color,
            width: p.size,
            height: p.type === 'confetti' ? p.size : p.size * 5,
            transform: `rotate(${p.rotation}deg)`,
            borderRadius: p.type === 'confetti' ? '2px' : '1px',
          }}
        />
      ))}
    </div>
  );
}
