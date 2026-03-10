export const MOODS = [
  {
    id: 'happy',
    label: 'Happy',
    emoji: '😄',
    color: 'from-yellow-200 to-amber-300',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.5)]',
    border: 'border-amber-300',
    chartColor: '#FCD34D',
    score: 9,
  },
  {
    id: 'calm',
    label: 'Calm',
    emoji: '😌',
    color: 'from-green-200 to-teal-300',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-700',
    glow: 'shadow-[0_0_20px_rgba(45,212,191,0.5)]',
    border: 'border-teal-300',
    chartColor: '#5EEAD4',
    score: 8,
  },
  {
    id: 'sad',
    label: 'Sad',
    emoji: '😢',
    color: 'from-blue-200 to-indigo-300',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.5)]',
    border: 'border-blue-300',
    chartColor: '#818CF8',
    score: 3,
  },
  {
    id: 'angry',
    label: 'Angry',
    emoji: '😤',
    color: 'from-red-200 to-rose-300',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-700',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.5)]',
    border: 'border-rose-300',
    chartColor: '#FB7185',
    score: 2,
  },
  {
    id: 'tired',
    label: 'Tired',
    emoji: '😴',
    color: 'from-purple-200 to-violet-300',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-700',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.5)]',
    border: 'border-violet-300',
    chartColor: '#A78BFA',
    score: 4,
  },
  {
    id: 'excited',
    label: 'Excited',
    emoji: '🤩',
    color: 'from-pink-200 to-fuchsia-300',
    bgColor: 'bg-fuchsia-100',
    textColor: 'text-fuchsia-700',
    glow: 'shadow-[0_0_20px_rgba(217,70,239,0.5)]',
    border: 'border-fuchsia-300',
    chartColor: '#E879F9',
    score: 10,
  },
];

export const INFLUENCES = [
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'health', label: 'Health', emoji: '💪' },
  { id: 'sleep', label: 'Sleep', emoji: '🌙' },
  { id: 'friends', label: 'Friends', emoji: '👫' },
  { id: 'diet', label: 'Diet', emoji: '🥗' },
  { id: 'hobbies', label: 'Hobbies', emoji: '🎨' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
];

export const ACTIVITIES = [
  {
    id: 'breathing',
    title: 'Breathing Exercise',
    description: 'Calm your mind with 4-7-8 breathing technique',
    iconId: 'breathing',
    gradient: 'from-sky-100 via-blue-100 to-indigo-100',
    iconBg: 'bg-sky-200',
    duration: '5 min',
    color: '#93C5FD',
  },
  {
    id: 'journal',
    title: 'Mindful Journal',
    description: 'Write freely about your thoughts and feelings',
    iconId: 'journal',
    gradient: 'from-purple-100 via-violet-100 to-fuchsia-100',
    iconBg: 'bg-violet-200',
    duration: '10 min',
    color: '#C4B5FD',
  },
  {
    id: 'meditation',
    title: 'Meditation',
    description: 'Find peace with a guided mindfulness session',
    iconId: 'meditation',
    gradient: 'from-emerald-100 via-teal-100 to-cyan-100',
    iconBg: 'bg-teal-200',
    duration: '15 min',
    color: '#6EE7B7',
  },
];

export const getMoodById = (id) => MOODS.find((m) => m.id === id);
export const getMoodByLabel = (label) => MOODS.find((m) => m.label === label);

export const getDayLabels = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  return Array.from({ length: 7 }, (_, i) => days[(today - 6 + i + 7) % 7]);
};
