import React from 'react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#DFE9F6] dark:bg-dark-wellness-gradient flex items-center justify-center p-4 transition-colors duration-300 overflow-hidden relative">
      <div className="w-full max-w-6xl min-h-[650px] bg-white/40 dark:bg-dark-card/60 backdrop-blur-3xl border border-white/50 dark:border-dark-border/50 rounded-[40px] shadow-glass-xl flex overflow-hidden flex-col md:flex-row relative z-10">
        
        {/* Left Side: Auth Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col h-full"
          >
            <div className="mb-12">
               <span className="text-xl font-bold tracking-wider text-slate-800 dark:text-dark-text uppercase">EmoGraph</span>
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-sm">
              {title && (
                <h1 className="text-3xl lg:text-4xl font-light text-slate-900 dark:text-dark-text mb-3">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-slate-500 dark:text-dark-muted mb-8">
                  {subtitle}
                </p>
              )}
              {children}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Decorative Graphic */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#c6d7fa] to-[#e4eefb] dark:from-dark-card dark:to-dark-wellness-gradient flex items-center justify-center p-8 relative overflow-hidden min-h-[400px] md:min-h-full">
          {/* Abstract 3D Sphere implementation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative w-64 h-64 md:w-80 md:h-80 z-10"
          >
             <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3B07EE] via-[#2A37E3] to-[#7E0FF2] shadow-[0_30px_60px_rgba(0,0,0,0.3)]" 
                style={{
                  boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.5), inset 20px 20px 40px rgba(255,255,255,0.4), 0 30px 60px rgba(0,0,0,0.2)'
                }}
             />
             <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
             >
                {/* Glowing neon lines mimicking the reference sphere details */}
                <div className="w-full h-full border border-[#FF2994]/40 absolute top-[10%] left-[5%] rounded-full opacity-60 shadow-[0_0_20px_#FF2994]" 
                     style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', transform: 'rotate(-20deg)' }} />
                <div className="w-[110%] h-[110%] border-t-[3px] border-[#38B9FF]/60 absolute top-[-5%] left-[-5%] rounded-full opacity-70 shadow-[0_0_25px_#38B9FF]" 
                     style={{ transform: 'rotate(70deg)' }} />
             </motion.div>
             <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
             >
                <div className="w-[90%] h-[90%] border-b-[2px] border-[#FF2994]/50 absolute top-[5%] left-[5%] rounded-full opacity-50 shadow-[0_0_15px_#FF2994]" 
                     style={{ transform: 'rotate(45deg)' }} />
             </motion.div>
          </motion.div>
          {/* subtle ground shadow */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.5 }}
             className="absolute bottom-16 md:bottom-32 w-48 h-10 bg-black/10 blur-2xl rounded-[100%]"
          />
        </div>

      </div>
    </div>
  );
}
