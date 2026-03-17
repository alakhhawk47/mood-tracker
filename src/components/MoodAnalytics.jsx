import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import { MOODS } from '../utils/moodData';

const PIE_COLORS = MOODS.map((m) => m.chartColor);

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm border border-white/50 dark:border-dark-border/30 rounded-xl px-4 py-3 shadow-lg text-xs">
        <p className="font-heading font-semibold text-day-text dark:text-dark-text mb-1">{label}</p>
        <p className="text-day-primary dark:text-night-primary font-heading font-bold text-sm">Score: {payload[0].value?.toFixed(1) ?? '—'}/10</p>
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
      gradient: 'from-day-primary/8 to-day-accent/8',
      valueColor: avgScore >= 7 ? 'text-emerald-500' : avgScore >= 5 ? 'text-amber-500' : 'text-rose-400',
    },
    {
      label: 'Total Logs',
      value: totalLogs,
      gradient: 'from-day-secondary/10 to-pink-100/30',
      valueColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    },
    {
      label: 'Current Trend',
      value: trendInfo ? trendInfo.label : '—',
      gradient: 'from-amber-50/50 to-orange-50/50',
      valueColor: trendInfo?.color || 'text-gray-400',
    },
  ];

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
            className={`bg-gradient-to-br ${card.gradient} dark:bg-dark-card/50 border border-white/40 dark:border-dark-border/30 backdrop-blur-sm rounded-2xl p-5 shadow-card dark:shadow-none transition-colors duration-300`}
          >
            <p className="text-xs text-gray-500 dark:text-dark-muted font-body font-medium mb-1">{card.label}</p>
            <p className={`text-xl font-heading font-bold ${card.valueColor}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-xl border border-white/40 dark:border-dark-border/30 rounded-2xl shadow-card dark:shadow-none p-6 transition-colors duration-300"
      >
        <h3 className="font-heading font-bold text-day-text dark:text-dark-text text-sm mb-4">Weekly Mood Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="analyticsLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7C5CFC" />
                <stop offset="100%" stopColor="#36D6B5" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,92,252,0.08)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone" dataKey="score" stroke="url(#analyticsLineGrad)" strokeWidth={3}
              dot={{ fill: '#7C5CFC', r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#7C5CFC' }}
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
          className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-xl border border-white/40 dark:border-dark-border/30 rounded-2xl shadow-card dark:shadow-none p-6 transition-colors duration-300"
        >
          <h3 className="font-heading font-bold text-day-text dark:text-dark-text text-sm mb-4">Mood Distribution</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => {
                    const moodItem = MOODS.find((m) => m.label === entry.name || m.id === entry.name);
                    return <Cell key={`cell-${index}`} fill={moodItem?.chartColor || PIE_COLORS[index % PIE_COLORS.length]} />;
                  })}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} entries`, name]}
                  contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 min-w-[120px]">
              {pieData.map((entry, i) => {
                const moodItem = MOODS.find((m) => m.label === entry.name || m.id === entry.name);
                return (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: moodItem?.chartColor || PIE_COLORS[i] }} />
                    <span className="text-xs text-gray-600 dark:text-dark-muted font-body">{entry.name}</span>
                    <span className="text-xs text-gray-400 dark:text-dark-muted ml-auto font-body">{entry.value}</span>
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
