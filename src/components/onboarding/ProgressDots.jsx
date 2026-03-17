import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressDots({ total = 3, current = 0, onDotClick }) {
  return (
    <div className="flex justify-center items-center gap-2.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onDotClick?.(i)}
          aria-label={`Go to slide ${i + 1}`}
          className="rounded-full transition-colors duration-300 focus:outline-none"
          animate={{
            width: i === current ? 28 : 10,
            height: 10,
            backgroundColor: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
          }}
          whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.7)' }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        />
      ))}
    </div>
  );
}
