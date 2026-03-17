import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MoodSelector from '../components/MoodSelector';
import MoodAuraOrb from '../components/MoodAuraOrb';
import ConfettiEffect from '../components/ConfettiEffect';
import GradientBlob from '../components/ui/GradientBlob';
import GlassCard from '../components/ui/GlassCard';
import { useMoodHistory } from '../hooks/useMoodHistory';
import { INFLUENCES, getMoodById } from '../utils/moodData';

export default function CheckIn() {
  const navigate = useNavigate();
  const { addEntry } = useMoodHistory();

  const [selectedMood, setSelectedMood] = useState(null);
  const [scale, setScale] = useState(5);
  const [journal, setJournal] = useState('');
  const [selectedInfluences, setSelectedInfluences] = useState([]);
  const [saved, setSaved] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const toggleInfluence = (id) => {
    setSelectedInfluences((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!selectedMood) return;
    const success = addEntry({
      mood: selectedMood,
      scale,
      note: journal,
      influences: selectedInfluences,
    });
    if (success) {
      setConfettiTrigger((t) => t + 1);
      setSaved(true);
      setTimeout(() => navigate('/dashboard'), 2200);
    }
  };

  const moodObj = getMoodById(selectedMood);

  return (
    <div className="min-h-screen bg-day-bg dark:bg-night-bg relative overflow-x-hidden transition-colors duration-500">
      <ConfettiEffect mood={selectedMood} trigger={confettiTrigger} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-50 dark:opacity-15">
        <GradientBlob className="w-80 h-80 bg-day-primary/20 top-[-4rem] left-[-4rem]" />
        <GradientBlob className="w-64 h-64 bg-day-secondary/20 bottom-[8rem] right-[-3rem]" style={{ animationDelay: '3s' }} />
      </div>

      <Sidebar />

      <div className="lg:pl-64 relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">

          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-400 dark:text-dark-muted hover:text-day-text dark:hover:text-dark-text text-sm mb-4 transition-colors font-body"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-heading font-bold text-day-text dark:text-dark-text">Mood Check-In</h1>
            <p className="text-gray-500 dark:text-dark-muted text-sm font-body mt-1">Take a moment to reflect on how you're feeling</p>
          </motion.div>

          {/* Success */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-5 mb-6 text-center"
              >
                <p className="font-heading font-bold text-emerald-700 dark:text-emerald-400">Mood logged successfully!</p>
                <p className="text-emerald-500 dark:text-emerald-500/80 text-sm font-body">Redirecting to dashboard...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!saved && (
            <>
              {/* Mood Orb (shows when mood is selected) */}
              <AnimatePresence>
                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-center mb-6"
                  >
                    <MoodAuraOrb mood={selectedMood} size={140} intensity={scale} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 1: Mood Selection */}
              <GlassCard className="p-6 mb-5" delay={0.1} moodTint={selectedMood}>
                <h2 className="font-heading font-bold text-day-text dark:text-dark-text mb-1">How are you feeling?</h2>
                <p className="text-gray-400 dark:text-dark-muted text-xs font-body mb-5">Select the mood that best describes you right now</p>
                <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />
              </GlassCard>

              {/* Step 2: Scale */}
              <GlassCard className="p-6 mb-5" delay={0.15} moodTint={selectedMood}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="font-heading font-bold text-day-text dark:text-dark-text">Mood Intensity</h2>
                    <p className="text-gray-400 dark:text-dark-muted text-xs font-body">Rate the intensity of your feeling</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-heading font-bold ${moodObj?.bgColor || 'bg-gray-100 dark:bg-dark-card'} ${moodObj?.textColor || 'text-gray-700 dark:text-dark-text'}`}>
                    {scale}
                  </div>
                </div>

                <input
                  type="range" min="1" max="10" value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full h-2 rounded-full accent-day-primary cursor-pointer"
                  style={{ background: `linear-gradient(to right, #7C5CFC ${(scale - 1) * 11.1}%, #E5E7EB ${(scale - 1) * 11.1}%)` }}
                />
                <div className="flex justify-between text-xs text-gray-400 dark:text-dark-muted font-body mt-1">
                  <span>1 — Low</span>
                  <span>10 — High</span>
                </div>
              </GlassCard>

              {/* Step 3: Journal */}
              <GlassCard className="p-6 mb-5" delay={0.2} moodTint={selectedMood}>
                <h2 className="font-heading font-bold text-day-text dark:text-dark-text mb-1">Write your thoughts</h2>
                <p className="text-gray-400 dark:text-dark-muted text-xs font-body mb-3">What's on your mind? (optional)</p>
                <textarea
                  maxLength={200} value={journal} onChange={(e) => setJournal(e.target.value)}
                  placeholder="Today I feel..."
                  rows={4}
                  className="w-full p-4 rounded-xl bg-white/60 dark:bg-night-surface/50 border border-white/50 dark:border-dark-border/40 text-day-text dark:text-dark-text text-sm font-body placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-day-primary/30 focus:border-day-primary/40 resize-none transition-all"
                />
                <p className="text-xs text-gray-400 text-right mt-1 font-body">{journal.length}/200</p>
              </GlassCard>

              {/* Step 4: Influences */}
              <GlassCard className="p-6 mb-7" delay={0.25} moodTint={selectedMood}>
                <h2 className="font-heading font-bold text-day-text dark:text-dark-text mb-1">What's influencing your mood?</h2>
                <p className="text-gray-400 dark:text-dark-muted text-xs font-body mb-4">Select all that apply (optional)</p>
                <div className="flex flex-wrap gap-2">
                  {INFLUENCES.map((inf) => {
                    const isSelected = selectedInfluences.includes(inf.id);
                    return (
                      <motion.button
                        key={inf.id}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleInfluence(inf.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-body font-medium border-2 transition-all duration-200 ${
                          isSelected
                            ? 'bg-gradient-to-r from-day-primary to-day-accent text-white border-transparent shadow-mood'
                            : 'bg-white/50 dark:bg-dark-card/40 border-white/40 dark:border-dark-border/30 text-gray-600 dark:text-dark-muted hover:border-day-primary/30'
                        }`}
                      >
                        {inf.emoji} {inf.label}
                      </motion.button>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Save Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!selectedMood}
                className={`w-full py-4 rounded-2xl font-heading font-bold text-base shadow-lg transition-all duration-300 ${
                  selectedMood
                    ? 'bg-gradient-to-r from-day-primary to-day-accent text-white shadow-mood hover:shadow-glass-lg'
                    : 'bg-gray-200 dark:bg-dark-card text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                {selectedMood ? 'Save Entry' : 'Select a mood to continue'}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
