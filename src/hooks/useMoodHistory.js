import { useState, useEffect, useCallback } from 'react';
import { auth } from '../firebase';
import { MOODS } from '../utils/moodData';

const STORAGE_KEY = 'moodHistory';

function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function useMoodHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHistory(getHistory());
    setLoading(false);
  }, []);

  const userEmail = auth.currentUser?.email;

  const userHistory = history.filter(
    (h) => !userEmail || h.user === userEmail
  );

  const addEntry = useCallback(
    ({ mood, scale, note, influences = [] }) => {
      if (!mood) return false;
      const entry = {
        id: Date.now(),
        mood,
        scale: Number(scale),
        note,
        influences,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        user: auth.currentUser?.email || 'guest',
      };
      const updated = [entry, ...history];
      setHistory(updated);
      saveHistory(updated);
      return true;
    },
    [history]
  );

  const editEntry = useCallback(
    (id, updates) => {
      const updated = history.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      setHistory(updated);
      saveHistory(updated);
    },
    [history]
  );

  const deleteEntry = useCallback(
    (id) => {
      const updated = history.filter((item) => item.id !== id);
      setHistory(updated);
      saveHistory(updated);
    },
    [history]
  );

  const deleteMultiple = useCallback(
    (ids) => {
      const updated = history.filter((item) => !ids.includes(item.id));
      setHistory(updated);
      saveHistory(updated);
    },
    [history]
  );

  // ── Analytics helpers ──────────────────────────────────────────────────────

  const avgScore = userHistory.length
    ? (
        userHistory.reduce((s, h) => s + Number(h.scale), 0) /
        userHistory.length
      ).toFixed(1)
    : 0;

  const latestMood = userHistory[0]?.mood || null;

  const trend =
    userHistory.length >= 2
      ? userHistory[0].scale > userHistory[1].scale
        ? 'improving'
        : userHistory[0].scale < userHistory[1].scale
        ? 'declining'
        : 'stable'
      : null;

  // Weekly chart data: last 7 days
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('en', { weekday: 'short' });
    const dateStr = d.toLocaleDateString();
    const dayEntries = userHistory.filter((h) => h.date === dateStr);
    const score = dayEntries.length
      ? dayEntries.reduce((s, h) => s + Number(h.scale), 0) / dayEntries.length
      : null;
    return { day: label, score, entries: dayEntries.length };
  });

  // Mood distribution for pie chart
  const moodDistribution = userHistory.reduce((acc, h) => {
    acc[h.mood] = (acc[h.mood] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(moodDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  // ── NEW: Streak (consecutive days logged) ──────────────────────────────────
  const streak = (() => {
    if (!userHistory.length) return 0;
    const uniqueDates = [...new Set(userHistory.map((h) => h.date))].sort(
      (a, b) => new Date(b) - new Date(a)
    );
    let count = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);
    for (const dateStr of uniqueDates) {
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      const diff = Math.round((current - d) / (1000 * 60 * 60 * 24));
      if (diff === 0 || diff === 1) {
        count++;
        current = d;
      } else {
        break;
      }
    }
    return count;
  })();

  // ── NEW: Positive percentage this week ────────────────────────────────────
  const positivePct = (() => {
    const weekEntries = weeklyData.filter((d) => d.score !== null);
    if (!weekEntries.length) return null;
    const positive = weekEntries.filter((d) => d.score >= 6).length;
    return Math.round((positive / weekEntries.length) * 100);
  })();

  // ── NEW: Contextual suggestion ─────────────────────────────────────────────
  const suggestion = (() => {
    if (!latestMood) return 'Start logging your mood each day to get personalized insights.';
    const map = {
      happy: 'Keep it up! Share your positivity with someone you care about today.',
      calm: 'Great state to be in. Try a 10-minute journaling session to deepen your clarity.',
      sad: 'Be gentle with yourself. A short walk or breathing exercise can help lift your spirits.',
      angry: 'Take a few deep breaths. A 5-minute meditation can help release tension.',
      tired: 'Rest is productive. Prioritize sleep tonight and take breaks during the day.',
      excited: 'Channel that energy! Set a small goal you can accomplish today.',
    };
    return map[latestMood] || 'Check in daily to unlock deeper insights about your emotional health.';
  })();

  // ── NEW: Calendar data — map of dateStr → latest entry for that day ────────
  const getMoodForDate = (dateStr) =>
    userHistory.find((h) => h.date === dateStr) || null;

  // Build a calendar map for a given month (year, month 0-indexed)
  const getCalendarMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = date.toLocaleDateString();
      result[key] = userHistory.find((h) => h.date === key) || null;
    }
    return result;
  };

  return {
    history: userHistory,
    allHistory: history,
    loading,
    addEntry,
    editEntry,
    deleteEntry,
    deleteMultiple,
    avgScore,
    latestMood,
    trend,
    weeklyData,
    pieData,
    streak,
    positivePct,
    suggestion,
    getMoodForDate,
    getCalendarMonth,
  };
}
