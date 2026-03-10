import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import useTheme from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative w-10 h-10 flex items-center justify-center rounded-xl shadow-md transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-dark-card border border-dark-border text-yellow-300 hover:bg-dark-card-hover'
          : 'bg-white/80 backdrop-blur-md border border-white text-indigo-500 hover:bg-white'
      }`}
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme === 'dark' ? 'moon' : 'sun'}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          {theme === 'dark' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
