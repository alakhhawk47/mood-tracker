import React from 'react';
import { motion } from 'framer-motion';
import OnboardingIllustration from './OnboardingIllustration';

const textVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function OnboardingScreen({ illustration, headline, subtext, ctaLabel, onCtaClick }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-8 w-full max-w-md mx-auto">
      {/* Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <OnboardingIllustration variant={illustration} />
      </motion.div>

      {/* Headline */}
      <motion.h1
        custom={0}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-3 tracking-tight"
        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.08)' }}
      >
        {headline}
      </motion.h1>

      {/* Subtext */}
      <motion.p
        custom={1}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="text-base sm:text-lg text-white/75 leading-relaxed max-w-xs font-medium"
      >
        {subtext}
      </motion.p>

      {/* CTA Button (only on last screen) */}
      {ctaLabel && (
        <motion.button
          custom={2}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCtaClick}
          className="
            mt-10 px-10 py-4 rounded-2xl font-bold text-base
            bg-white/95 dark:bg-white/90 text-violet-700 dark:text-violet-800
            shadow-[0_8px_30px_rgba(167,139,250,0.3)]
            hover:shadow-[0_12px_40px_rgba(167,139,250,0.4)]
            transition-shadow duration-300
            backdrop-blur-sm
          "
        >
          {ctaLabel}
        </motion.button>
      )}
    </div>
  );
}
