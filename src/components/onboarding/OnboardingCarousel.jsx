import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressDots from './ProgressDots';
import OnboardingScreen from './OnboardingScreen';

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

export default function OnboardingCarousel({ screens, onFinish, onScreenChange }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (idx) => {
      if (idx < 0 || idx >= screens.length) return;
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
      onScreenChange?.(idx);
    },
    [current, screens.length]
  );

  const handleNext = useCallback(() => {
    if (current < screens.length - 1) goTo(current + 1);
  }, [current, screens.length, goTo]);

  const handlePrev = useCallback(() => {
    if (current > 0) goTo(current - 1);
  }, [current, goTo]);

  const handleDragEnd = useCallback(
    (_e, { offset, velocity }) => {
      const power = swipePower(offset.x, velocity.x);
      if (power < -swipeConfidenceThreshold) handleNext();
      else if (power > swipeConfidenceThreshold) handlePrev();
    },
    [handleNext, handlePrev]
  );

  const screen = screens[current];
  const isLast = current === screens.length - 1;

  return (
    <div className="flex flex-col flex-1 relative overflow-hidden">
      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={screen.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <OnboardingScreen
              illustration={screen.illustration}
              headline={screen.headline}
              subtext={screen.subtext}
              ctaLabel={isLast ? 'Start Tracking' : undefined}
              onCtaClick={isLast ? onFinish : undefined}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 px-6 pb-10 pt-4 flex flex-col items-center gap-5">
        <ProgressDots total={screens.length} current={current} onDotClick={goTo} />

        {/* Continue / next button (hidden on last screen — CTA is inline) */}
        {!isLast && (
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="
              w-full max-w-xs py-4 rounded-2xl font-bold text-base
              bg-white/90 dark:bg-white/85 text-violet-700 dark:text-violet-800
              shadow-[0_8px_30px_rgba(167,139,250,0.25)]
              hover:shadow-[0_12px_40px_rgba(167,139,250,0.35)]
              transition-shadow duration-300
              backdrop-blur-sm
            "
          >
            Continue
          </motion.button>
        )}
      </div>
    </div>
  );
}
