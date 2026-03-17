import React from 'react';
import { motion } from 'framer-motion';
import OnboardingCarousel from '../components/onboarding/OnboardingCarousel';

/* ─── Screen data ─── */
const SCREENS = [
  {
    id: 'calm',
    illustration: 'calm',
    headline: 'Find Your Calm',
    subtext: 'Track your emotions and understand your mental patterns.',
    bg: 'from-violet-400 via-purple-300 to-fuchsia-300',
    darkBg: 'dark:from-violet-900 dark:via-purple-800 dark:to-fuchsia-900',
  },
  {
    id: 'insights',
    illustration: 'insights',
    headline: 'Understand Your Feelings',
    subtext: 'Analyze mood trends and discover emotional insights.',
    bg: 'from-sky-300 via-blue-300 to-indigo-300',
    darkBg: 'dark:from-sky-900 dark:via-blue-900 dark:to-indigo-800',
  },
  {
    id: 'habits',
    illustration: 'habits',
    headline: 'Build Better Habits',
    subtext: 'Start your journey toward emotional wellness.',
    bg: 'from-rose-300 via-pink-300 to-fuchsia-300',
    darkBg: 'dark:from-rose-900 dark:via-pink-900 dark:to-fuchsia-800',
  },
];

/* ─── Animated background blobs ─── */
function BackgroundBlobs({ screenIndex }) {
  // Shift blob colors per screen
  const blobSets = [
    // Screen 1 — lavender / soft purple
    [
      { color: 'bg-violet-300/30 dark:bg-violet-600/20', size: 'w-80 h-80', pos: '-top-20 -left-20', delay: 0 },
      { color: 'bg-purple-200/25 dark:bg-purple-700/15', size: 'w-64 h-64', pos: 'bottom-10 -right-16', delay: 2 },
      { color: 'bg-fuchsia-200/20 dark:bg-fuchsia-700/10', size: 'w-48 h-48', pos: 'top-1/3 right-8', delay: 4 },
    ],
    // Screen 2 — pastel blue
    [
      { color: 'bg-sky-300/30 dark:bg-sky-600/20', size: 'w-72 h-72', pos: '-top-16 -right-16', delay: 0 },
      { color: 'bg-blue-200/25 dark:bg-blue-700/15', size: 'w-56 h-56', pos: 'bottom-20 -left-12', delay: 2 },
      { color: 'bg-indigo-200/20 dark:bg-indigo-700/10', size: 'w-44 h-44', pos: 'top-1/4 left-1/4', delay: 4 },
    ],
    // Screen 3 — light pink
    [
      { color: 'bg-rose-300/30 dark:bg-rose-600/20', size: 'w-80 h-80', pos: '-bottom-20 -left-20', delay: 0 },
      { color: 'bg-pink-200/25 dark:bg-pink-700/15', size: 'w-60 h-60', pos: '-top-10 right-0', delay: 2 },
      { color: 'bg-fuchsia-200/20 dark:bg-fuchsia-700/10', size: 'w-52 h-52', pos: 'bottom-1/3 right-1/4', delay: 4 },
    ],
  ];

  const blobs = blobSets[screenIndex] || blobSets[0];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {blobs.map((blob, i) => (
        <motion.div
          key={`${screenIndex}-${i}`}
          className={`absolute rounded-full ${blob.color} ${blob.size} ${blob.pos} blur-3xl`}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, i % 2 === 0 ? 20 : -20, 0],
            y: [0, i % 2 === 0 ? -15 : 15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8 + i * 2,
            ease: 'easeInOut',
            delay: blob.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Onboarding Page ─── */
export default function Onboarding() {
  const [screenIndex, setScreenIndex] = React.useState(0);

  const handleFinish = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    window.location.href = '/';
  };

  // Track screen index from carousel for background sync
  const currentScreen = SCREENS[screenIndex];

  return (
    <div
      className={`
        min-h-screen bg-gradient-to-br
        ${currentScreen.bg} ${currentScreen.darkBg}
        relative overflow-hidden flex flex-col
        transition-colors duration-700
      `}
    >
      {/* Animated background blobs */}
      <BackgroundBlobs screenIndex={screenIndex} />

      {/* Skip button */}
      <div className="relative z-20 flex justify-end px-6 pt-6 pb-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFinish}
          className="
            text-white/60 hover:text-white text-sm font-semibold
            px-4 py-2 rounded-xl
            bg-white/10 hover:bg-white/20
            backdrop-blur-sm border border-white/15
            transition-all duration-300
          "
        >
          Skip
        </motion.button>
      </div>

      {/* Carousel with screens */}
      <OnboardingCarousel
        screens={SCREENS}
        onFinish={handleFinish}
        onScreenChange={setScreenIndex}
      />
    </div>
  );
}
