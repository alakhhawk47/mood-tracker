import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import GradientBlob from '../components/ui/GradientBlob';
import GlassCard from '../components/ui/GlassCard';
import { useMoodHistory } from '../hooks/useMoodHistory';
import { getMoodById } from '../utils/moodData';

export default function Constellation() {
  const canvasRef = useRef(null);
  const { history } = useMoodHistory();
  const [hoveredStar, setHoveredStar] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, entry: null });

  // Build star positions from mood history
  const stars = history.slice(0, 50).map((entry, i) => {
    const mood = getMoodById(entry.mood);
    // Distribute stars in a constellation pattern
    const angle = (i / Math.max(history.length, 1)) * Math.PI * 4 + i * 0.7;
    const radius = 80 + i * 8 + Math.sin(i * 0.5) * 40;
    return {
      ...entry,
      mood: mood,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 3 + (entry.scale || 5) * 0.4,
      color: mood?.auraColor || '#A78BFA',
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const cx = canvas.getBoundingClientRect().width / 2;
    const cy = canvas.getBoundingClientRect().height / 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);

      // Draw connections
      for (let i = 1; i < stars.length; i++) {
        const prev = stars[i - 1];
        const curr = stars[i];
        ctx.beginPath();
        ctx.moveTo(cx + prev.x, cy + prev.y);
        ctx.lineTo(cx + curr.x, cy + curr.y);
        ctx.strokeStyle = `${curr.color}30`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw stars
      stars.forEach((star, i) => {
        const sx = cx + star.x;
        const sy = cy + star.y;

        // Glow
        const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.size * 4);
        gradient.addColorStop(0, `${star.color}40`);
        gradient.addColorStop(1, `${star.color}00`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(sx - star.size * 0.3, sy - star.size * 0.3, star.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Background twinkle stars
      for (let i = 0; i < 80; i++) {
        const bx = (Math.sin(i * 137.508) * 0.5 + 0.5) * canvas.getBoundingClientRect().width;
        const by = (Math.cos(i * 137.508 * 0.7) * 0.5 + 0.5) * canvas.getBoundingClientRect().height;
        const bsize = 0.5 + Math.random() * 1;
        const alpha = 0.1 + Math.sin(Date.now() * 0.001 + i) * 0.1;
        ctx.fillStyle = `rgba(200,200,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(bx, by, bsize, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    draw();
    const animFrame = setInterval(draw, 100);
    window.addEventListener('resize', resize);
    return () => { clearInterval(animFrame); window.removeEventListener('resize', resize); };
  }, [stars]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    for (const star of stars) {
      const sx = cx + star.x;
      const sy = cy + star.y;
      if (Math.hypot(mx - sx, my - sy) < star.size + 10) {
        setTooltip({ show: true, x: e.clientX, y: e.clientY, entry: star });
        return;
      }
    }
    setTooltip({ show: false, x: 0, y: 0, entry: null });
  };

  return (
    <div className="min-h-screen bg-[#0a0b1a] relative overflow-x-hidden">
      <Sidebar />

      <div className="lg:pl-64 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-8">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-2xl font-heading font-bold text-white">Mood Constellation</h1>
            <p className="text-gray-400 text-sm font-body mt-1">Your emotional starscape — each mood is a star</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
              <p className="text-xl font-heading font-bold text-white">{stars.length}</p>
              <p className="text-xs text-gray-400 font-body mt-1">Stars</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
              <p className="text-xl font-heading font-bold text-purple-400">{[...new Set(stars.map(s => s.mood?.id))].length}</p>
              <p className="text-xs text-gray-400 font-body mt-1">Moods</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
              <p className="text-xl font-heading font-bold text-cyan-400">{stars.length > 1 ? stars.length - 1 : 0}</p>
              <p className="text-xs text-gray-400 font-body mt-1">Connections</p>
            </div>
          </div>

          {/* Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#080916] rounded-2xl border border-white/10 overflow-hidden"
            style={{ height: '500px' }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full constellation-canvas cursor-crosshair"
              onClick={handleCanvasClick}
            />

            {stars.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl block mb-3">⭐</span>
                  <p className="text-white font-heading font-semibold">No stars yet</p>
                  <p className="text-gray-400 text-sm font-body mt-1">Log moods to build your constellation</p>
                </div>
              </div>
            )}

            {/* Tooltip */}
            {tooltip.show && tooltip.entry && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed z-50 bg-[#161830] border border-white/20 rounded-xl p-3 shadow-lg pointer-events-none"
                style={{ left: tooltip.x + 10, top: tooltip.y - 60 }}
              >
                <p className="text-xs text-gray-400 font-body">{tooltip.entry.date}</p>
                <p className="text-sm font-heading font-semibold text-white">
                  {tooltip.entry.mood?.emoji} {tooltip.entry.mood?.label}
                </p>
                {tooltip.entry.note && (
                  <p className="text-xs text-gray-300 font-body mt-1 max-w-[200px] truncate">{tooltip.entry.note}</p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {['happy', 'calm', 'sad', 'angry', 'tired', 'excited', 'anxious'].map((moodId) => {
              const m = getMoodById(moodId);
              if (!m) return null;
              return (
                <div key={moodId} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.auraColor }} />
                  <span className="text-xs text-gray-400 font-body">{m.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
