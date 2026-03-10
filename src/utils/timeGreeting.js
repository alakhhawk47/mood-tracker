export function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function getTimeEmoji() {
  const hour = new Date().getHours();
  if (hour < 12) return '☀️';
  if (hour < 17) return '🌤️';
  return '🌙';
}

export function getMotivationalQuote() {
  const quotes = [
    "Every day is a fresh start. 🌱",
    "Your feelings are always valid. 💜",
    "Small steps lead to big changes. 🌸",
    "Be kind to yourself today. 🤍",
    "Peace begins from within. 🧘",
    "You are stronger than you think. ✨",
    "Every moment is a new beginning. 🌅",
  ];
  return quotes[new Date().getDay() % quotes.length];
}
