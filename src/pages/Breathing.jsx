import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/ui/GlassCard';
import GradientBlob from '../components/ui/GradientBlob';

const EXERCISES = [
  {
    id: '478',
    title: '4-7-8 Breathing',
    description: 'Calming technique for anxiety & sleep',
    emoji: '🌊',
    gradient: 'from-blue-100 to-cyan-50',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Exhale', duration: 8 },
    ],
    cycles: 4,
  },
  {
    id: 'box',
    title: 'Box Breathing',
    description: 'Navy SEAL technique for focus & calm',
    emoji: '📦',
    gradient: 'from-purple-100 to-violet-50',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold', duration: 4 },
    ],
    cycles: 4,
  },
  {
    id: 'relax',
    title: 'Relax Breathing',
    description: 'Simple deep breathing for relaxation',
    emoji: '🍃',
    gradient: 'from-green-100 to-teal-50',
    phases: [
      { name: 'Inhale', duration: 5 },
      { name: 'Exhale', duration: 5 },
    ],
    cycles: 6,
  },
];

export default function Breathing() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef(null);

  const currentPhase = selectedExercise?.phases[currentPhaseIdx];
  const totalPhases = selectedExercise?.phases.length || 1;

  // Calculate scale for the breathing circle
  const getCircleScale = () => {
    if (!currentPhase || !isRunning) return 1;
    const progress = 1 - phaseTimeLeft / currentPhase.duration;
    if (currentPhase.name === 'Inhale') return 1 + progress * 0.5;
    if (currentPhase.name === 'Exhale') return 1.5 - progress * 0.5;
    return 1.3; // Hold
  };

  const tick = useCallback(() => {
    setPhaseTimeLeft((prev) => {
      if (prev <= 1) {
        // Move to next phase or cycle
        setCurrentPhaseIdx((pi) => {
          const nextPi = pi + 1;
          if (nextPi >= totalPhases) {
            // Cycle complete
            setCurrentCycle((c) => {
              if (c + 1 >= selectedExercise.cycles) {
                // All cycles done
                setIsRunning(false);
                setCompleted(true);
                clearInterval(intervalRef.current);
                return c;
              }
              return c + 1;
            });
            return 0;
          }
          return nextPi;
        });
        // Set next phase duration
        return selectedExercise.phases[((currentPhaseIdx + 1) % totalPhases)].duration;
      }
      return prev - 1;
    });
  }, [currentPhaseIdx, totalPhases, selectedExercise]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, tick]);

  const startExercise = (exercise) => {
    setSelectedExercise(exercise);
    setCurrentCycle(0);
    setCurrentPhaseIdx(0);
    setPhaseTimeLeft(exercise.phases[0].duration);
    setIsRunning(false);
    setCompleted(false);
  };

  const toggleRunning = () => setIsRunning(!isRunning);

  const reset = () => {
    clearInterval(intervalRef.current);
    setSelectedExercise(null);
    setIsRunning(false);
    setCompleted(false);
  };

  const scale = getCircleScale();

  const phaseColors = {
    'Inhale': { bg: 'from-day-primary/40 to-day-accent/40', text: 'text-day-primary dark:text-night-primary' },
    'Hold': { bg: 'from-day-secondary/40 to-amber-300/40', text: 'text-day-secondary dark:text-night-secondary' },
    'Exhale': { bg: 'from-day-accent/40 to-emerald-400/40', text: 'text-day-accent dark:text-night-accent' },
  };

  const phaseStyle = currentPhase ? phaseColors[currentPhase.name] || phaseColors['Hold'] : phaseColors['Inhale'];

  return (
    <div className="min-h-screen bg-day-bg dark:bg-night-bg relative overflow-x-hidden transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-50 dark:opacity-15">
        <GradientBlob className="w-80 h-80 bg-day-accent/20 top-[-4rem] left-[-4rem]" />
        <GradientBlob className="w-72 h-72 bg-day-primary/20 bottom-[8rem] right-[-3rem]" style={{ animationDelay: '3s' }} />
      </div>

      <Sidebar />

      <div className="lg:pl-64 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-heading font-bold text-day-text dark:text-dark-text">Breathing Exercises</h1>
            <p className="text-gray-500 dark:text-dark-muted text-sm font-body mt-1">Calm your nervous system</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedExercise ? (
              <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <GlassCard className="p-8 flex flex-col items-center" hover={false}>
                  <h2 className="font-heading font-bold text-lg text-day-text dark:text-dark-text mb-1">{selectedExercise.title}</h2>
                  <p className="text-sm text-gray-400 dark:text-dark-muted font-body mb-6">
                    Cycle {currentCycle + 1} of {selectedExercise.cycles}
                  </p>

                  {/* Breathing circle */}
                  <div className="relative w-56 h-56 flex items-center justify-center mb-8">
                    {/* Outer rings */}
                    <motion.div
                      animate={{ scale: scale * 0.95, opacity: 0.2 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      className={`absolute w-56 h-56 rounded-full bg-gradient-to-br ${phaseStyle.bg}`}
                    />
                    <motion.div
                      animate={{ scale: scale * 0.85, opacity: 0.3 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${phaseStyle.bg}`}
                    />
                    {/* Main circle */}
                    <motion.div
                      animate={{ scale }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      className={`w-40 h-40 rounded-full bg-gradient-to-br ${phaseStyle.bg} backdrop-blur-xl border border-white/30 dark:border-dark-border/30 flex items-center justify-center shadow-lg`}
                    >
                      <div className="text-center">
                        {completed ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <span className="text-4xl block mb-1">✨</span>
                            <p className="text-sm font-heading font-bold text-emerald-500">Done!</p>
                          </motion.div>
                        ) : (
                          <>
                            <motion.p
                              key={currentPhase?.name}
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`text-lg font-heading font-bold ${phaseStyle.text}`}
                            >
                              {currentPhase?.name || '—'}
                            </motion.p>
                            <p className="text-3xl font-heading font-bold text-day-text dark:text-dark-text mt-1">
                              {phaseTimeLeft}
                            </p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Phase indicators */}
                  <div className="flex gap-2 mb-6">
                    {selectedExercise.phases.map((p, i) => (
                      <div
                        key={i}
                        className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-all ${
                          i === currentPhaseIdx && isRunning
                            ? 'bg-day-primary/20 text-day-primary dark:text-night-primary'
                            : 'text-gray-400 dark:text-dark-muted'
                        }`}
                      >
                        {p.name} ({p.duration}s)
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {!completed && (
                      <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={toggleRunning}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-day-primary to-day-accent text-white font-heading font-bold text-sm shadow-mood"
                      >
                        {isRunning ? 'Pause' : 'Start'}
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={reset}
                      className="px-6 py-3 rounded-xl bg-white/50 dark:bg-dark-card/50 border border-white/40 dark:border-dark-border/30 text-gray-600 dark:text-dark-muted font-body font-medium text-sm"
                    >
                      Back
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {EXERCISES.map((ex, i) => (
                    <motion.div
                      key={ex.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(124,92,252,0.15)' }}
                      onClick={() => startExercise(ex)}
                      className={`bg-gradient-to-br ${ex.gradient} dark:bg-dark-card/40 dark:from-dark-card/60 dark:to-dark-card/30 rounded-2xl p-6 border border-white/40 dark:border-dark-border/30 cursor-pointer transition-all`}
                    >
                      <span className="text-4xl mb-4 block">{ex.emoji}</span>
                      <h3 className="font-heading font-bold text-day-text dark:text-dark-text text-base mb-1">{ex.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-dark-muted font-body mb-3">{ex.description}</p>
                      <div className="flex gap-1 flex-wrap">
                        {ex.phases.map((p, pi) => (
                          <span key={pi} className="text-[10px] bg-white/50 dark:bg-dark-card/50 px-2 py-0.5 rounded-full text-gray-500 dark:text-dark-muted font-body">
                            {p.name} {p.duration}s
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-day-primary dark:text-night-primary font-body font-semibold mt-3">{ex.cycles} cycles</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
