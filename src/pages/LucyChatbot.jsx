import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import GradientBlob from '../components/ui/GradientBlob';

// ─── Lucy's personality and response logic ───────────────────────────────────

const GREETING = {
  id: 'greeting',
  role: 'lucy',
  text: "Hi, I'm Lucy 💜 I'm here to support your mental wellness. Tell me how you're feeling today.",
  time: new Date(),
};

const COPING_STRATEGIES = [
  { trigger: ['anxious', 'anxiety', 'panic', 'scared', 'worry', 'worried', 'nervous'],
    responses: [
      "I hear you — anxiety can feel overwhelming. Try this: breathe in for 4 counts, hold for 7, exhale for 8. This 4-7-8 technique signals safety to your nervous system. 🌬️",
      "Those anxious feelings are real and valid. One thing that helps: anchor yourself by naming **5 things you can see**, 4 you can touch, 3 you can hear. 🌿",
      "Anxiety often comes from thoughts about the future. Can we stay in this moment together? What's one thing that's okay right now, right in this room?",
    ]
  },
  { trigger: ['sad', 'depressed', 'unhappy', 'down', 'low', 'grief', 'crying', 'cry'],
    responses: [
      "I'm really glad you shared that with me. Sadness is a sign you deeply care about something. What's been weighing on your heart? 💙",
      "It's okay to have tough days. Emotions like sadness don't need to be fixed — they need to be felt. I'm here to sit with you in it.",
      "When you feel ready, even a 5-minute walk outside can shift your body's chemistry. But first — what's going on? I'd love to understand.",
    ]
  },
  { trigger: ['stress', 'stressed', 'overwhelmed', 'burnout', 'exhausted', 'tired', 'pressure'],
    responses: [
      "Burnout is real. Your nervous system is asking for rest. Can you name one thing on your list that could wait until tomorrow? 🍃",
      "When overwhelmed, our instinct is to do more — but the antidote is often less. What's one boundary you could set today?",
      "Let's try Box Breathing: breathe in 4 counts → hold 4 → exhale 4 → hold 4. Repeat 3 times. This resets your stress response. Would you like to try it now?",
    ]
  },
  { trigger: ['angry', 'angry', 'rage', 'mad', 'furious', 'frustrated', 'irritated', 'annoyed'],
    responses: [
      "Anger is a signal, not a flaw. It's usually telling you something important. What do you think is beneath the anger right now? 🔥",
      "Before anything else — breathe. In through the nose (4 sec), hold (4 sec), out through the mouth (6 sec). Let's not act from the heat of the moment.",
      "I understand. Your feelings make complete sense given what you've shared. What would feel like justice or relief in this situation?",
    ]
  },
  { trigger: ['happy', 'great', 'amazing', 'wonderful', 'excited', 'joyful', 'good', 'fantastic'],
    responses: [
      "That's beautiful! 🌟 When we're in a positive state, it's a great time to journal what's working — your future self will thank you.",
      "Love to hear it! Positive emotions build resilience over time. What's been the highlight of your day?",
      "Yes! This energy is precious. Let's explore what's making you feel this way — understanding your joy helps you recreate it. ✨",
    ]
  },
  { trigger: ['sleep', 'insomnia', 'cant sleep', "can't sleep", 'tired', 'wake up', 'nightmares'],
    responses: [
      "Poor sleep is so hard on the body and mind. Try a body scan tonight: lie down, close your eyes, and slowly bring awareness from your toes to your head, releasing tension as you go. 🌙",
      "Sleep hygiene matters a lot. Try keeping your phone away for 30 minutes before bed and dimming lights. Your melatonin will thank you.",
      "A guided sleep meditation might really help. Try going to the **Meditation** section — I have a Sleep Prep session there for you. 🧘",
    ]
  },
  { trigger: ['lonely', 'alone', 'isolated', 'no one', 'nobody', 'disconnected'],
    responses: [
      "Loneliness is one of the hardest feelings. But you reached out right now — and I'm genuinely here with you. That matters. 💜",
      "Connection is a core need. Even small acts — texting someone you care about, joining a class — can shift that feeling. What feels possible today?",
      "Sometimes loneliness isn't about being alone — it's about feeling unseen. Tell me more. I want to understand your world.",
    ]
  },
  { trigger: ['meditation', 'meditate', 'breathe', 'breathing', 'calm', 'relax', 'peace'],
    responses: [
      "Wonderful! Meditation is one of the most powerful tools for mental wellness. Head to the **Meditation** page to begin a guided session. 🧘‍♀️",
      "Even 5 minutes of intentional breathing can shift your entire inner state. Try our **Breathing** exercises — I designed them for different emotional states.",
      "Calm is not the absence of emotions — it's being at peace with them. A gentle breathwork practice can help you get there. 🌿",
    ]
  },
  { trigger: ['journal', 'write', 'express', 'feelings', 'thoughts'],
    responses: [
      "Journaling is such a powerful way to process emotions. Try stream-of-consciousness: set a timer for 5 minutes and write without lifting your pen. No judgment.",
      "Writing helps us externalize what's internal. Head to the **Check-In** page and journal your mood — it becomes your emotional record over time.",
    ]
  },
  { trigger: ['hi', 'hello', 'hey', 'start', 'begin'],
    responses: [
      "Hello! 🌸 I'm so glad you're here. What's on your mind today?",
      "Hey there! 💜 I'm Lucy — your mental wellness companion. How are you feeling right now?",
    ]
  },
];

const FALLBACK_RESPONSES = [
  "I hear you. Can you tell me more about that? Understanding you better helps me support you. 💜",
  "Thank you for sharing that with me. This is a safe space — what else is on your mind?",
  "That sounds significant. How long have you been feeling this way?",
  "I appreciate you opening up. What do you think is at the root of how you're feeling?",
  "You're not alone in this. Take your time — I'm here, and I'm listening. 🌿",
  "Sometimes just naming how we feel is the first step. What would you like to explore further?",
];

const SUGGESTIONS = [
  "I'm feeling anxious today",
  "I need help with stress",
  "I've been feeling down",
  "How do I meditate?",
  "I can't sleep well",
  "I feel really good today!",
];

function getLucyResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  for (const strategy of COPING_STRATEGIES) {
    if (strategy.trigger.some((t) => lower.includes(t))) {
      const arr = strategy.responses;
      return arr[Math.floor(Math.random() * arr.length)];
    }
  }
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
function renderBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function ChatBubble({ msg, isNew }) {
  const isLucy = msg.role === 'lucy';
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 16, scale: 0.97 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`flex items-end gap-2 mb-4 ${isLucy ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      {isLucy ? (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-day-primary to-day-accent dark:from-night-primary dark:to-night-accent flex items-center justify-center flex-shrink-0 shadow-mood mb-1">
          <span className="text-white text-xs font-bold">L</span>
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-day-secondary to-day-primary dark:from-night-secondary dark:to-night-primary flex items-center justify-center flex-shrink-0 shadow-sm mb-1">
          <span className="text-white text-xs font-bold">Y</span>
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[78%] ${isLucy ? 'items-start' : 'items-end'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm font-body leading-relaxed ${
          isLucy
            ? 'bg-white/60 dark:bg-dark-card/70 backdrop-blur-xl border border-white/50 dark:border-dark-border/30 text-day-text dark:text-dark-text rounded-tl-sm shadow-card'
            : 'bg-gradient-to-br from-day-primary to-day-accent dark:from-night-primary dark:to-night-accent text-white rounded-tr-sm shadow-mood'
        }`}>
          {renderBold(msg.text)}
        </div>
        <p className="text-[10px] text-gray-400 dark:text-dark-muted font-body px-1">
          {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-end gap-2 mb-4"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-day-primary to-day-accent flex items-center justify-center flex-shrink-0 shadow-mood">
        <span className="text-white text-xs font-bold">L</span>
      </div>
      <div className="bg-white/60 dark:bg-dark-card/70 backdrop-blur-xl border border-white/50 dark:border-dark-border/30 rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, delay }}
              className="w-2 h-2 rounded-full bg-day-primary/60 dark:bg-night-primary/60"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LucyChatbot() {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [newMsgId, setNewMsgId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: text.trim(), time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay (1.2–2.2s)
    const delay = 1200 + Math.random() * 1000;
    setTimeout(() => {
      const lucyText = getLucyResponse(text);
      const lucyMsg = { id: Date.now() + 1, role: 'lucy', text: lucyText, time: new Date() };
      setIsTyping(false);
      setNewMsgId(lucyMsg.id);
      setMessages((prev) => [...prev, lucyMsg]);
    }, delay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="min-h-screen bg-day-bg dark:bg-night-bg relative overflow-hidden transition-colors duration-500">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-50 dark:opacity-15">
        <GradientBlob className="w-96 h-96 bg-day-primary/20 top-[-6rem] right-[-6rem]" />
        <GradientBlob className="w-72 h-72 bg-day-accent/20 bottom-[8rem] left-[-4rem]" style={{ animationDelay: '4s' }} />
        <GradientBlob className="w-64 h-64 bg-day-secondary/15 top-[40%] left-[30%]" style={{ animationDelay: '7s' }} />
      </div>

      <Sidebar />

      <div className="lg:pl-64 relative z-10 h-screen flex flex-col">
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 pb-24 lg:pb-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-4"
          >
            {/* Lucy avatar orb */}
            <div className="relative">
              <motion.div
                animate={{ boxShadow: ['0 0 20px 8px rgba(124,92,252,0.25)', '0 0 35px 15px rgba(124,92,252,0.4)', '0 0 20px 8px rgba(124,92,252,0.25)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-day-primary via-day-accent to-day-secondary dark:from-night-primary dark:via-night-accent dark:to-night-secondary flex items-center justify-center shadow-mood"
              >
                <span className="text-white text-2xl">🌸</span>
              </motion.div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-night-bg" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-day-text dark:text-dark-text">Lucy AI</h1>
              <p className="text-xs text-emerald-500 font-body font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online · Your wellness companion
              </p>
            </div>
          </motion.div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto pr-1 mb-4 min-h-0">
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatBubble key={msg.id} msg={msg} isNew={msg.id === newMsgId} />
              ))}
              {isTyping && <TypingIndicator key="typing" />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-3 flex flex-wrap gap-2"
            >
              {SUGGESTIONS.map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(s)}
                  className="text-xs font-body px-3 py-1.5 rounded-full bg-white/60 dark:bg-dark-card/60 backdrop-blur-lg border border-white/50 dark:border-dark-border/30 text-day-primary dark:text-night-primary hover:border-day-primary/40 dark:hover:border-night-primary/40 transition-all shadow-sm"
                >
                  {s}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Input Box */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <div className="flex items-center gap-3 bg-white/60 dark:bg-dark-card/60 backdrop-blur-xl border border-white/60 dark:border-dark-border/30 rounded-2xl px-4 py-3 shadow-glass dark:shadow-none transition-colors duration-300 focus-within:border-day-primary/40 dark:focus-within:border-night-primary/40">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share how you're feeling..."
                className="flex-1 bg-transparent text-sm font-body text-day-text dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-muted outline-none"
                disabled={isTyping}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isTyping}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-day-primary to-day-accent dark:from-night-primary dark:to-night-accent flex items-center justify-center shadow-sm disabled:opacity-40 transition-opacity flex-shrink-0"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </motion.button>
            </div>
            <p className="text-[10px] text-center text-gray-400 dark:text-dark-muted font-body mt-2">
              Lucy is an AI companion. For clinical support, please consult a professional. 💜
            </p>
          </motion.form>

        </div>
      </div>
    </div>
  );
}
