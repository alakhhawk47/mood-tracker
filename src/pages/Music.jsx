import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/ui/GlassCard';
import GradientBlob from '../components/ui/GradientBlob';

const CATEGORIES = [
  { id: 'relax', label: 'Relax', emoji: '🌊', gradient: 'from-blue-100 to-cyan-50' },
  { id: 'focus', label: 'Focus', emoji: '🎯', gradient: 'from-amber-100 to-yellow-50' },
  { id: 'sleep', label: 'Sleep', emoji: '🌙', gradient: 'from-indigo-100 to-purple-50' },
  { id: 'stress', label: 'Stress Relief', emoji: '🍃', gradient: 'from-green-100 to-teal-50' },
  { id: 'meditation', label: 'Meditation', emoji: '🧘', gradient: 'from-pink-100 to-rose-50' },
];

const TRACKS = {
  relax: [
    { id: 'r1', title: 'Ocean Waves', artist: 'Nature Sounds', duration: '5:30', color: '#60A5FA' },
    { id: 'r2', title: 'Rainfall', artist: 'Ambient Earth', duration: '8:15', color: '#34D399' },
    { id: 'r3', title: 'Gentle Stream', artist: 'Waterscapes', duration: '6:45', color: '#818CF8' },
    { id: 'r4', title: 'Wind Chimes', artist: 'Garden Sounds', duration: '4:20', color: '#F472B6' },
  ],
  focus: [
    { id: 'f1', title: 'Deep Focus Alpha', artist: 'Brain Beats', duration: '10:00', color: '#FBBF24' },
    { id: 'f2', title: 'Lo-Fi Study', artist: 'Chill Beats', duration: '12:30', color: '#F97316' },
    { id: 'f3', title: 'Piano Focus', artist: 'Keys & Mind', duration: '8:00', color: '#EAB308' },
  ],
  sleep: [
    { id: 's1', title: 'Dreamy Night', artist: 'Sleep Lab', duration: '15:00', color: '#8B5CF6' },
    { id: 's2', title: 'Stars & Silence', artist: 'Cosmos Audio', duration: '20:00', color: '#6366F1' },
    { id: 's3', title: 'Lullaby Harp', artist: 'Diana Sleep', duration: '10:30', color: '#A78BFA' },
  ],
  stress: [
    { id: 'st1', title: 'Forest Bathing', artist: 'Nature Therapy', duration: '7:00', color: '#34D399' },
    { id: 'st2', title: 'Tibetan Bowls', artist: 'Healing Tones', duration: '9:00', color: '#10B981' },
    { id: 'st3', title: 'Birdsong Morning', artist: 'Avian Audio', duration: '6:00', color: '#6EE7B7' },
  ],
  meditation: [
    { id: 'm1', title: 'Om Chanting', artist: 'Sacred Sounds', duration: '11:00', color: '#EC4899' },
    { id: 'm2', title: 'Crystal Bowls', artist: 'Resonance', duration: '8:30', color: '#F472B6' },
    { id: 'm3', title: 'Flute Meditation', artist: 'Zen Music', duration: '7:15', color: '#FB7185' },
  ],
};

export default function Music() {
  const [activeCategory, setActiveCategory] = useState('relax');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  const tracks = TRACKS[activeCategory] || [];

  useEffect(() => {
    if (isPlaying && currentTrack) {
      progressRef.current = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.5));
      }, 200);
    }
    return () => clearInterval(progressRef.current);
  }, [isPlaying, currentTrack]);

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-day-bg dark:bg-night-bg relative overflow-x-hidden transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-50 dark:opacity-15">
        <GradientBlob className="w-80 h-80 bg-day-secondary/20 top-[-4rem] right-[-4rem]" />
        <GradientBlob className="w-72 h-72 bg-day-primary/20 bottom-[8rem] left-[-3rem]" style={{ animationDelay: '3s' }} />
      </div>

      <Sidebar />

      <div className="lg:pl-64 relative z-10">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-8 ${currentTrack ? 'pb-40' : 'pb-28'} lg:pb-8`}>
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-heading font-bold text-day-text dark:text-dark-text">Music for Moods</h1>
            <p className="text-gray-500 dark:text-dark-muted text-sm font-body mt-1">Sounds to match your state of mind</p>
          </motion.div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-day-primary text-white shadow-mood dark:bg-night-primary'
                    : 'bg-white/50 dark:bg-dark-card/50 text-gray-500 dark:text-dark-muted border border-white/40 dark:border-dark-border/30'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* Tracks */}
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="space-y-3">
                {tracks.map((track, i) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ x: 4 }}
                    onClick={() => playTrack(track)}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                      currentTrack?.id === track.id
                        ? 'bg-day-primary/10 dark:bg-night-primary/15 border border-day-primary/20 dark:border-night-primary/20'
                        : 'bg-white/50 dark:bg-dark-card/50 border border-white/40 dark:border-dark-border/30 hover:bg-white/70 dark:hover:bg-dark-card/70'
                    }`}
                  >
                    {/* Play button */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ background: `${track.color}22` }}
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex gap-0.5">
                          {[1, 2, 3].map((b) => (
                            <motion.div
                              key={b}
                              animate={{ height: [8, 16, 8] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: b * 0.15 }}
                              className="w-1 rounded-full"
                              style={{ backgroundColor: track.color }}
                            />
                          ))}
                        </motion.div>
                      ) : (
                        <svg className="w-5 h-5" fill={track.color} viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-sm text-day-text dark:text-dark-text truncate">{track.title}</h3>
                      <p className="text-xs text-gray-400 dark:text-dark-muted font-body">{track.artist}</p>
                    </div>

                    <span className="text-xs text-gray-400 dark:text-dark-muted font-body flex-shrink-0">{track.duration}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Music Player */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 lg:bottom-0 lg:left-64 left-0 right-0 z-30 bg-white/80 dark:bg-night-surface/90 backdrop-blur-2xl border-t border-white/40 dark:border-dark-border/40 p-4"
          >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-dark-border/50">
              <motion.div
                className="h-full rounded-r-full"
                style={{ background: currentTrack.color, width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-4 max-w-4xl mx-auto">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${currentTrack.color}22` }}>
                <span className="text-lg">🎵</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-heading font-semibold text-day-text dark:text-dark-text truncate">{currentTrack.title}</p>
                <p className="text-xs text-gray-400 dark:text-dark-muted font-body">{currentTrack.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-day-primary dark:bg-night-primary flex items-center justify-center text-white shadow-sm"
                >
                  {isPlaying ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                  ) : (
                    <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setCurrentTrack(null); setIsPlaying(false); }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-dark-text"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
