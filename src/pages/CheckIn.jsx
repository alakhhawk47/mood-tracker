import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MoodSelector from '../components/MoodSelector';
import GradientBlob from '../components/ui/GradientBlob';
import { useMoodHistory } from '../hooks/useMoodHistory';
import { INFLUENCES, getMoodById } from '../utils/moodData';

export default function CheckIn() {
  const navigate = useNavigate();
  const { addEntry } = useMoodHistory();

  const [step, setStep] = useState(1); // 1: mood, 2: journal+influences
  const [selectedMood, setSelectedMood] = useState(null);
  const [scale, setScale] = useState(5);
  const [journal, setJournal] = useState('');
  const [selectedInfluences, setSelectedInfluences] = useState([]);
  const [saved, setSaved] = useState(false);

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
      setSaved(true);
      setTimeout(() => navigate('/dashboard'), 1800);
    }
  };

  const moodObj = getMoodById(selectedMood);

  return (
    <div className="min-h-screen bg-wellness-gradient dark:bg-dark-wellness-gradient relative overflow-x-hidden transition-colors duration-300">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-100 dark:opacity-30 transition-opacity duration-300">
        <GradientBlob className="w-80 h-80 bg-soft-purple top-[-4rem] left-[-4rem]" />
        <GradientBlob className="w-64 h-64 bg-soft-pink bottom-[8rem] right-[-3rem]" style={{ animationDelay: '3s' }} />
      </div>

      <Sidebar />

      <div className="lg:pl-64 relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-400 dark:text-dark-muted hover:text-slate-600 dark:hover:text-dark-text text-sm mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-dark-text">Mood Check-In</h1>
            <p className="text-slate-500 dark:text-dark-muted text-sm mt-1">Take a moment to reflect on how you're feeling</p>
          </motion.div>

          {/* Success message */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-5 mb-6 text-center"
              >
                <p className="font-bold text-emerald-700 dark:text-emerald-400">Mood logged successfully!</p>
                <p className="text-emerald-500 dark:text-emerald-500/80 text-sm">Redirecting to dashboard...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!saved && (
            <>
              {/* Step 1: Mood Selection */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl border border-white/70 dark:border-dark-border/50 rounded-2xl shadow-card dark:shadow-none p-6 mb-5"
              >
                <h2 className="font-bold text-slate-700 dark:text-dark-text mb-1">How are you feeling?</h2>
                <p className="text-slate-400 dark:text-dark-muted text-xs mb-5">Select the mood that best describes you right now</p>
                <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />
              </motion.div>

              {/* Step 2: Scale */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl border border-white/70 dark:border-dark-border/50 rounded-2xl shadow-card dark:shadow-none p-6 mb-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="font-bold text-slate-700 dark:text-dark-text">Mood Intensity</h2>
                    <p className="text-slate-400 dark:text-dark-muted text-xs">Rate the intensity of your feeling</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${moodObj?.bgColor || 'bg-slate-100'} ${moodObj?.textColor || 'text-slate-700'}`}>
                    {scale}
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full h-2 rounded-full accent-soft-purple cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #A78BFA ${(scale - 1) * 11.1}%, #E9D5FF ${(scale - 1) * 11.1}%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-slate-400 dark:text-dark-muted mt-1">
                  <span>1 — Low</span>
                  <span>10 — High</span>
                </div>
              </motion.div>

              {/* Step 3: Journal */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl border border-white/70 dark:border-dark-border/50 rounded-2xl shadow-card dark:shadow-none p-6 mb-5"
              >
                <h2 className="font-bold text-slate-700 dark:text-dark-text mb-1">Write your thoughts</h2>
                <p className="text-slate-400 dark:text-dark-muted text-xs mb-3">What's on your mind? (optional)</p>
                <textarea
                  maxLength={200}
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  placeholder="Today I feel..."
                  rows={4}
                  className="
                    w-full p-4 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-white/80 dark:border-slate-700
                    text-slate-700 dark:text-dark-text text-sm placeholder-slate-300 dark:placeholder-slate-500
                    focus:outline-none focus:ring-2 focus:ring-soft-purple/30 dark:focus:ring-soft-purple/50 focus:border-soft-purple/40
                    resize-none transition-all
                  "
                />
                <p className="text-xs text-slate-400 text-right mt-1">{journal.length}/200</p>
              </motion.div>

              {/* Step 4: Influences */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl border border-white/70 dark:border-dark-border/50 rounded-2xl shadow-card dark:shadow-none p-6 mb-7"
              >
                <h2 className="font-bold text-slate-700 dark:text-dark-text mb-1">What's influencing your mood?</h2>
                <p className="text-slate-400 dark:text-dark-muted text-xs mb-4">Select all that apply (optional)</p>
                <div className="flex flex-wrap gap-2">
                  {INFLUENCES.map((inf) => {
                    const isSelected = selectedInfluences.includes(inf.id);
                    return (
                      <motion.button
                        key={inf.id}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleInfluence(inf.id)}
                        className={`
                          flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium
                          border-2 transition-all duration-200
                          ${isSelected
                            ? 'bg-gradient-to-r from-soft-purple to-deep-purple text-white border-transparent shadow-mood dark:shadow-none'
                            : 'bg-white/70 dark:bg-dark-card/40 border-white/70 dark:border-dark-border/50 text-slate-600 dark:text-dark-muted hover:border-soft-purple/30 dark:hover:border-soft-purple/50 shadow-sm dark:shadow-none'
                          }
                        `}
                      >
                        {inf.label}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Save Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!selectedMood}
                className={`
                  w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-all duration-300
                  ${selectedMood
                    ? 'bg-gradient-to-r from-soft-purple to-deep-purple text-white shadow-mood hover:shadow-glass-lg dark:shadow-none'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }
                `}
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
