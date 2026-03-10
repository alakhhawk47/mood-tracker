import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { MOODS } from '../utils/moodData';

const PIE_COLORS = MOODS.map((m) => m.chartColor);

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    return (
      <div className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm border border-white/70 dark:border-dark-border/50 rounded-xl px-4 py-3 shadow-card dark:shadow-none text-xs">
        <p className="font-semibold text-slate-700 dark:text-dark-text mb-1">{label}</p>
        <p className="text-soft-purple dark:text-dark-accent font-bold text-sm">Score: {score?.toFixed(1) ?? '—'}/10</p>
      </div>
    );
  }
  return null;
}

export default function MoodAnalytics({ weeklyData = [], pieData = [], avgScore = 0, totalLogs = 0, trend = null }) {

  const trendConfig = {
    improving: { label: 'Improving', color: 'text-emerald-500' },
    declining: { label: 'Declining', color: 'text-rose-500' },
    stable:    { label: 'Stable',    color: 'text-amber-500' },
  };

  const trendInfo = trendConfig[trend] || null;

  const statCards = [
    {
      label: 'Average Mood',
      value: avgScore > 0 ? `${avgScore}/10` : '—',
      gradient: 'from-soft-purple/10 to-pastel-blue/10',
      valueColor: avgScore >= 7 ? 'text-emerald-500' : avgScore >= 5 ? 'text-amber-500' : 'text-rose-400',
    },
    {
      label: 'Total Logs',
      value: totalLogs,
      gradient: 'from-soft-pink/20 to-lavender/20',
      valueColor: 'text-fuchsia-600',
    },
    {
      label: 'Current Trend',
      value: trendInfo ? trendInfo.label : '—',
      gradient: 'from-warm-beige to-soft-pink/20',
      valueColor: trendInfo?.color || 'text-slate-400',
    },
  ];

  // Filter out empty days for line chart display
  const chartData = weeklyData.map((d) => ({
    ...d,
    score: d.score !== null ? parseFloat(d.score.toFixed(1)) : null,
  }));

  return (
    <div className="w-full space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
            className={`bg-gradient-to-br ${card.gradient} dark:opacity-90 border border-white/70 dark:border-dark-border/50 backdrop-blur-sm rounded-2xl p-5 shadow-card dark:shadow-none`}
          >
            <p className="text-xs text-slate-500 dark:text-dark-muted font-medium mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.valueColor}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl border border-white/70 dark:border-dark-border/50 rounded-2xl shadow-card dark:shadow-none p-6"
      >
        <h3 className="font-bold text-slate-700 dark:text-dark-text text-sm mb-4">Weekly Mood Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#BFDBFE" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,139,250,0.1)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#lineGrad)"
              strokeWidth={3}
              dot={{ fill: '#A78BFA', r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#7C3AED' }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl border border-white/70 dark:border-dark-border/50 rounded-2xl shadow-card dark:shadow-none p-6"
        >
          <h3 className="font-bold text-slate-700 dark:text-dark-text text-sm mb-4">Mood Distribution</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => {
                    const moodItem = MOODS.find((m) => m.label === entry.name || m.id === entry.name);
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={moodItem?.chartColor || PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} entries`, name]}
                  contentStyle={{
                    background: 'rgba(255,255,255,0.9)',
                    border: '1px solid rgba(255,255,255,0.7)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex flex-col gap-2 min-w-[120px]">
              {pieData.map((entry, i) => {
                const moodItem = MOODS.find((m) => m.label === entry.name || m.id === entry.name);
                return (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: moodItem?.chartColor || PIE_COLORS[i] }}
                    />
                    <span className="text-xs text-slate-600 dark:text-dark-muted font-medium">{entry.name}</span>
                    <span className="text-xs text-slate-400 dark:text-dark-muted ml-auto">{entry.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
