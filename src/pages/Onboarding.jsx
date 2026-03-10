import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GradientBlob from '../components/ui/GradientBlob';

const SCREENS = [
  {
    id: 'welcome',
    bg: 'from-violet-400 via-purple-300 to-fuchsia-300',
    illustration: (
      <div className="relative flex items-center justify-center w-48 h-48 mx-auto mb-8">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-white/30"
        />
        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
          className="absolute inset-4 rounded-full border-2 border-white/20"
        />
        {/* Center card */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-3xl bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-xl"
        >
          <span className="text-5xl font-bold text-white/80">E</span>
        </motion.div>
      </div>
    ),
    title: 'Find Your Calm',
    subtitle: 'Build Your Balance',
    body: 'Your personal wellness companion for tracking emotions and building healthier mental habits.',
  },
  {
    id: 'features',
    bg: 'from-sky-300 via-blue-300 to-indigo-300',
    illustration: null,
    title: 'Everything You Need',
    subtitle: 'For Your Mental Wellbeing',
    body: null,
    features: [
      {
        icon: (
          <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        title: 'Track Your Emotions',
        desc: 'Log your daily mood in seconds with our intuitive emoji selector',
        gradient: 'from-violet-100 to-purple-100',
      },
      {
        icon: (
          <svg className="w-6 h-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
        title: 'Understand Patterns',
        desc: 'Discover trends and insights from your emotional data over time',
        gradient: 'from-sky-100 to-blue-100',
      },
      {
        icon: (
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        ),
        title: 'Improve Wellbeing',
        desc: 'Get personalized suggestions to support your mental health journey',
        gradient: 'from-emerald-100 to-teal-100',
      },
    ],
  },
  {
    id: 'start',
    bg: 'from-rose-300 via-pink-300 to-fuchsia-300',
    illustration: null,
    title: 'Start Your',
    subtitle: 'Mood Journey',
    body: 'Ready to understand yourself better? Your journey to emotional wellness begins now.',
    moods: ['😄', '😌', '😢', '😤', '😴', '🤩'],
  },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState(0);
  const [dir, setDir] = useState(1);

  const goTo = (idx) => {
    setDir(idx > screen ? 1 : -1);
    setScreen(idx);
  };

  const handleNext = () => {
    if (screen < SCREENS.length - 1) goTo(screen + 1);
    else handleFinish();
  };

  const handleFinish = () => {
    localStorage.setItem('onboarded', 'true');
    navigate('/');
  };

  const current = SCREENS[screen];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${current.bg} relative overflow-hidden flex flex-col`}>
      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-72 h-72 rounded-full bg-white/20 blur-3xl -top-16 -left-16" />
        <div className="absolute w-64 h-64 rounded-full bg-white/15 blur-3xl bottom-8 right-[-4rem]" />
      </div>

      {/* Skip button */}
      <div className="relative z-10 flex justify-end p-6">
        <button
          onClick={handleFinish}
          className="text-white/70 hover:text-white text-sm font-medium transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Screen content */}
      <div className="flex-1 relative z-10 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current.id}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            {/* Screen 1: Welcome */}
            {current.id === 'welcome' && (
              <>
                {current.illustration}
                <h1 className="text-4xl font-bold text-white text-center leading-tight mb-1">
                  {current.title}
                </h1>
                <p className="text-xl font-semibold text-white/80 text-center mb-4">
                  {current.subtitle}
                </p>
                <p className="text-white/70 text-center text-sm max-w-xs leading-relaxed">
                  {current.body}
                </p>
              </>
            )}

            {/* Screen 2: Features */}
            {current.id === 'features' && (
              <div className="w-full max-w-sm">
                <h1 className="text-3xl font-bold text-white text-center mb-1">{current.title}</h1>
                <p className="text-white/80 text-center text-sm mb-8">{current.subtitle}</p>
                <div className="space-y-3">
                  {current.features.map((feat, i) => (
                    <motion.div
                      key={feat.title}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.12, duration: 0.45 }}
                      className={`flex items-center gap-4 bg-gradient-to-r ${feat.gradient} backdrop-blur-sm rounded-2xl p-4 border border-white/60 shadow-card`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0 shadow-sm">
                        {feat.icon}
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{feat.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{feat.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Screen 3: Start */}
            {current.id === 'start' && (
              <div className="w-full max-w-sm text-center">
                <h1 className="text-4xl font-bold text-white mb-1">{current.title}</h1>
                <p className="text-3xl font-bold text-white/90 mb-4">{current.subtitle}</p>
                <p className="text-white/70 text-sm mb-8 leading-relaxed">{current.body}</p>

                {/* Mood row */}
                <div className="flex justify-center gap-3 mb-8">
                  {current.moods.map((emoji, i) => (
                    <motion.div
                      key={emoji}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15 + i * 0.07, duration: 0.4, ease: 'backOut' }}
                      whileHover={{ scale: 1.15, y: -4 }}
                      className="w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/50 flex items-center justify-center text-2xl shadow-md cursor-default"
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 px-6 pb-10">
        {/* Dot pagination */}
        <div className="flex justify-center gap-2 mb-6">
          {SCREENS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === screen
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Next / Start button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          className="
            w-full py-4 rounded-2xl font-bold text-base
            bg-white text-deep-purple
            shadow-xl hover:shadow-2xl transition-all duration-300
          "
        >
          {screen < SCREENS.length - 1 ? 'Continue' : 'Start Your Mood Journey'}
        </motion.button>
      </div>
    </div>
  );
}
