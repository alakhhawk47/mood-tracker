import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/ui/GlassCard';
import GradientBlob from '../components/ui/GradientBlob';
import { useMoodHistory } from '../hooks/useMoodHistory';
import { getMoodById } from '../utils/moodData';

// Plant SVG components
function Flower({ color, wiltLevel = 0, size = 1 }) {
  const stemColor = wiltLevel > 0.5 ? '#8B7355' : '#4ADE80';
  const opacity = 1 - wiltLevel * 0.4;
  return (
    <svg width={60 * size} height={80 * size} viewBox="0 0 60 80" style={{ opacity }}>
      {/* Stem */}
      <path d={`M30 80 Q30 50 ${30 + wiltLevel * 8} 35`} stroke={stemColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Leaf */}
      <ellipse cx={22 - wiltLevel * 3} cy={60} rx="8" ry="4" fill={stemColor} transform={`rotate(-30 22 60)`} opacity="0.7" />
      {/* Petals */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse
          key={i}
          cx="30" cy={25 + wiltLevel * 5}
          rx={8 - wiltLevel * 2} ry={12 - wiltLevel * 3}
          fill={color}
          transform={`rotate(${angle + wiltLevel * 15} 30 ${25 + wiltLevel * 5})`}
          opacity={0.8 - wiltLevel * 0.2}
        />
      ))}
      {/* Center */}
      <circle cx="30" cy={25 + wiltLevel * 5} r={4 - wiltLevel} fill={wiltLevel > 0.5 ? '#92400E' : '#FDE68A'} />
    </svg>
  );
}

function Sprout({ color, size = 1 }) {
  return (
    <svg width={40 * size} height={50 * size} viewBox="0 0 40 50">
      <path d="M20 50 Q20 30 20 20" stroke="#4ADE80" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="15" cy="22" rx="6" ry="10" fill={color} transform="rotate(-20 15 22)" opacity="0.7" />
      <ellipse cx="25" cy="25" rx="5" ry="8" fill={color} transform="rotate(15 25 25)" opacity="0.6" />
    </svg>
  );
}

function Wilted({ color, size = 1 }) {
  return (
    <svg width={50 * size} height={60 * size} viewBox="0 0 50 60">
      <path d="M25 60 Q25 40 30 25" stroke="#8B7355" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="20" rx="7" ry="5" fill={color} transform="rotate(40 32 20)" opacity="0.4" />
      <ellipse cx="28" cy="18" rx="5" ry="4" fill={color} transform="rotate(-20 28 18)" opacity="0.3" />
    </svg>
  );
}

function getPlant(entry) {
  const mood = getMoodById(entry.mood);
  if (!mood) return null;
  const score = entry.scale || mood.score;
  const color = mood.auraColor;

  if (score >= 7) return { component: 'flower', color, wilt: 0 };
  if (score >= 5) return { component: 'sprout', color, wilt: 0 };
  if (score >= 3) return { component: 'flower', color, wilt: 0.6 };
  return { component: 'wilted', color, wilt: 1 };
}

export default function Garden() {
  const { history, streak, positivePct } = useMoodHistory();

  const plants = useMemo(() => {
    return history.slice(0, 30).map((entry) => ({
      entry,
      plant: getPlant(entry),
      mood: getMoodById(entry.mood),
    }));
  }, [history]);

  const flowerCount = plants.filter(p => p.plant?.component === 'flower' && p.plant.wilt === 0).length;
  const sproutCount = plants.filter(p => p.plant?.component === 'sprout').length;
  const wiltedCount = plants.filter(p => p.plant?.component === 'wilted' || (p.plant?.component === 'flower' && p.plant.wilt > 0)).length;

  return (
    <div className="min-h-screen bg-day-bg dark:bg-night-bg relative overflow-x-hidden transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-50 dark:opacity-15">
        <GradientBlob className="w-80 h-80 bg-emerald-200/30 top-[-4rem] right-[-4rem]" />
        <GradientBlob className="w-72 h-72 bg-day-primary/20 bottom-[8rem] left-[-3rem]" style={{ animationDelay: '3s' }} />
      </div>

      <Sidebar />

      <div className="lg:pl-64 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-heading font-bold text-day-text dark:text-dark-text">Mood Garden</h1>
            <p className="text-gray-500 dark:text-dark-muted text-sm font-body mt-1">Watch your emotional garden grow</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            <GlassCard className="p-4 text-center" delay={0.1}>
              <span className="text-2xl block mb-1">🌸</span>
              <p className="text-xl font-heading font-bold text-pink-500">{flowerCount}</p>
              <p className="text-[10px] text-gray-400 dark:text-dark-muted font-body">Flowers</p>
            </GlassCard>
            <GlassCard className="p-4 text-center" delay={0.15}>
              <span className="text-2xl block mb-1">🌱</span>
              <p className="text-xl font-heading font-bold text-emerald-500">{sproutCount}</p>
              <p className="text-[10px] text-gray-400 dark:text-dark-muted font-body">Sprouts</p>
            </GlassCard>
            <GlassCard className="p-4 text-center" delay={0.2}>
              <span className="text-2xl block mb-1">🥀</span>
              <p className="text-xl font-heading font-bold text-amber-600">{wiltedCount}</p>
              <p className="text-[10px] text-gray-400 dark:text-dark-muted font-body">Wilted</p>
            </GlassCard>
            <GlassCard className="p-4 text-center" delay={0.25}>
              <span className="text-2xl block mb-1">🔥</span>
              <p className="text-xl font-heading font-bold text-day-primary dark:text-night-primary">{streak}</p>
              <p className="text-[10px] text-gray-400 dark:text-dark-muted font-body">Streak</p>
            </GlassCard>
          </div>

          {/* Garden Grid */}
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-day-text dark:text-dark-text text-base">Your Garden</h2>
              <p className="text-xs text-gray-400 dark:text-dark-muted font-body">{plants.length} plants</p>
            </div>

            {plants.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl block mb-4">🌱</span>
                <p className="font-heading font-semibold text-day-text dark:text-dark-text">Your garden is empty</p>
                <p className="text-sm text-gray-400 dark:text-dark-muted font-body mt-2">Log moods to grow your emotional garden</p>
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {plants.map((p, i) => (
                  <motion.div
                    key={p.entry.id || i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.2, y: -4 }}
                    className="flex flex-col items-center justify-end cursor-pointer group relative"
                    style={{ minHeight: '90px' }}
                  >
                    {/* Plant */}
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {p.plant?.component === 'flower' && <Flower color={p.plant.color} wiltLevel={p.plant.wilt} size={0.9} />}
                      {p.plant?.component === 'sprout' && <Sprout color={p.plant.color} size={0.9} />}
                      {p.plant?.component === 'wilted' && <Wilted color={p.plant.color} size={0.9} />}
                    </div>

                    {/* Ground */}
                    <div className="w-8 h-1.5 bg-amber-800/20 dark:bg-amber-800/30 rounded-full mt-0.5" />

                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm border border-white/50 dark:border-dark-border/30 rounded-lg px-2 py-1 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      <p className="text-[10px] font-body text-gray-500 dark:text-dark-muted">{p.entry.date}</p>
                      <p className="text-xs font-heading font-semibold text-day-text dark:text-dark-text">
                        {p.mood?.emoji} {p.mood?.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Garden Legend */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm">🌸</span>
              <span className="text-xs text-gray-400 dark:text-dark-muted font-body">Happy mood → Blooming flower</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🌱</span>
              <span className="text-xs text-gray-400 dark:text-dark-muted font-body">Neutral mood → Growing sprout</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🥀</span>
              <span className="text-xs text-gray-400 dark:text-dark-muted font-body">Low mood → Wilting plant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
