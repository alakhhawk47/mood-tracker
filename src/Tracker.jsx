import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { auth } from "./firebase";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function Tracker() {

  const [darkMode, setDarkMode] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);
  const [scale, setScale] = useState(5);
  const [journal, setJournal] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editItem, setEditItem] = useState(null);
const [selectedItems, setSelectedItems] = useState([]);

  const moods = [
    { emoji: "😄", label: "Joyful", color: "bg-yellow-400" },
    { emoji: "😔", label: "Low", color: "bg-blue-400" },
    { emoji: "😤", label: "Stressed", color: "bg-red-400" },
    { emoji: "😨", label: "Anxious", color: "bg-purple-400" },
    { emoji: "😌", label: "Peaceful", color: "bg-green-400" },
  ];

  useEffect(() => {
    const stored = localStorage.getItem("moodHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const handleSave = () => {
  if (!selectedMood) return alert("Select mood first");

  if (editItem) {
    // editing existing
    const updated = history.map(item =>
      item.id === editItem.id
        ? { ...item, mood: selectedMood, scale, note: journal }
        : item
    );

    setHistory(updated);
    localStorage.setItem("moodHistory", JSON.stringify(updated));
    setEditItem(null);
  } else {
    const entry = {
      id: Date.now(),
      mood: selectedMood,
      scale: Number(scale),
      note: journal,
      date: new Date().toLocaleDateString(),
      user: auth.currentUser?.email
    };

    const updated = [entry, ...history];
    setHistory(updated);
    localStorage.setItem("moodHistory", JSON.stringify(updated));
  }

  setJournal("");
};

const handleEdit = (item) => {
  setSelectedMood(item.mood);
  setScale(item.scale);
  setJournal(item.note);
  setEditItem(item);
};

const handleDelete = (id) => {
  const updated = history.filter(item => item.id !== id);
  setHistory(updated);
  localStorage.setItem("moodHistory", JSON.stringify(updated));
};

const handleMultiDelete = () => {
  const updated = history.filter(item => !selectedItems.includes(item.id));
  setHistory(updated);
  localStorage.setItem("moodHistory", JSON.stringify(updated));
  setSelectedItems([]);
};
// ===== MOOD CALCULATIONS (PUT BEFORE RETURN) =====
const moodScore = history.reduce((acc, item) => acc + Number(item.scale), 0);

const avg = history.length
  ? (moodScore / history.length).toFixed(1)
  : 0;

const percentage = avg ? avg * 10 : 0;

let insightMessage = "";

if (avg >= 8) insightMessage = "You're emotionally strong ";
else if (avg >= 6) insightMessage = "You're doing okay ";
else if (avg >= 4) insightMessage = "Mood fluctuating ";
else if (avg > 0) insightMessage = "Take care of yourself ";
else insightMessage = "Start logging moods";

let trend = "";

if (history.length >= 2) {
  const latest = history[0].scale;
  const previous = history[1].scale;

  if (latest > previous) trend = "Improving 📈";
  else if (latest < previous) trend = "Declining 📉";
  else trend = "Stable ➖";
}

const chartData = [
  {
    name: "Mood Avg",
    value: Number(avg),
  },
];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
darkMode ? "dark bg-[#020617] text-white" : "bg-white text-black"
}`}>
  {/* 🔵 TOP GLASS HEADER */}
<div className="max-w-6xl mx-auto px-6 pt-10">
  <div className="bg-white/10 backdrop-blur-xl border border-white/10 
  rounded-2xl shadow-xl p-6 text-center">

    <h1 className="text-4xl md:text-5xl font-bold">
      EmoGraph – Elite Mood Tracker
    </h1>

    <p className="opacity-70 mt-2">
      Track emotions • Measure intensity • Visualize your mental health
    </p>

  </div>
</div>

      {/* 🌙 Toggle Button */}
      <div className="absolute top-5 left-5">
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-2xl bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-110 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-6xl mx-auto px-6 py-16">
 <div className={`${darkMode 
? "bg-white/5 border border-white/10" 
: "bg-white/70"} 
backdrop-blur-xl rounded-3xl shadow-2xl p-10`}></div>

          {/* 🟢 Circular EmoGraph */}
<div className="flex flex-col items-center mb-6">

  <div className="relative w-48 h-48 mb-4">
    {/* background circle */}
    <div className="absolute inset-0 rounded-full border-[10px] border-gray-300"></div>

    {/* progress circle */}
    <div
      className="absolute inset-0 rounded-full border-[10px] border-green-400"
      style={{
        clipPath: `polygon(0 0, 100% 0, 100% ${percentage}%, 0 ${percentage}%)`,
      }}
    ></div>

    {/* avg number center */}
    <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
      {avg}
    </div>
  </div>

  {/* insight text BELOW circle */}
  <p className="text-center text-sm opacity-80">{insightMessage}</p>

  {/* trend text */}
  {trend && (
    <p className="text-center text-sm font-semibold mt-1">
      Trend: {trend}
    </p>
  )}

</div>

{/* 📅 PREMIUM MODERN CALENDAR */}
<div className="flex justify-center items-center mt-16">

  <div className={`
  w-full max-w-md p-6 rounded-3xl shadow-2xl
  ${darkMode 
    ? "bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/10" 
    : "bg-white/80"}
  backdrop-blur-xl`}>

    <h2 className="text-2xl font-bold text-center mb-6">
      Mood Calendar
    </h2>

    <Calendar
      onChange={setSelectedDate}
      value={selectedDate}
      className="modern-calendar"
      tileClassName={({ date, view }) => {
        if (view === "month") {
          const found = history.find(
            item =>
              new Date(item.date).toDateString() ===
              date.toDateString()
          );

          if (found?.mood === "Joyful") return "mood-joy";
          if (found?.mood === "Low") return "mood-low";
          if (found?.mood === "Stressed") return "mood-stress";
          if (found?.mood === "Anxious") return "mood-anxious";
          if (found?.mood === "Peaceful") return "mood-peace";
        }
      }}
    />

  </div>
  </div>
          {/* 😄 Mood Emojis */}
          <div className="flex justify-center gap-8 mb-10 flex-wrap">
            {moods.map((mood) => (
              <motion.div
                key={mood.label}
                whileHover={{ scale: 1.3, rotate: 8 }}
                className={`cursor-pointer p-4 rounded-xl shadow-lg transition ${
                  selectedMood === mood.label ? mood.color : "bg-white text-black"
                }`}
                onClick={() => setSelectedMood(mood.label)}
              >
                <div className="text-3xl">{mood.emoji}</div>
                <p className="text-sm">{mood.label}</p>
              </motion.div>
            ))}
          </div>

          {/* 📊 Scale */}
          <div className="mb-6">
            <p className="mb-2 font-medium">Mood Intensity: {scale}/10</p>
            <input
              type="range"
              min="1"
              max="10"
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              className="w-full"
            />
          </div>

          {/* 📝 Journal */}
          <textarea
  maxLength="140"
  value={journal}
  onChange={(e) => setJournal(e.target.value)}
  placeholder="Write about your day..."
  className="w-full p-4 rounded-xl text-black mb-6"
/>
<p className="text-xs opacity-60 text-right">
{journal.length}/140 characters
</p>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Save Entry
          </button>

          {/* Weekly Analytics Section */}
<div className="mt-16 w-full max-w-4xl bg-white/80 dark:bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
  
  <h2 className="text-3xl font-bold text-center mb-6">
     Weekly Mood Analytics
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

  {/* Average Mood */}
  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg text-center">
    <h3 className="text-lg font-semibold">Average Mood</h3>
    <p className="text-3xl font-bold mt-2">{avg}/10</p>
  </div>

  {/* Total Entries */}
  <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg text-center">
    <h3 className="text-lg font-semibold">Total Logs</h3>
    <p className="text-3xl font-bold mt-2">{history.length}</p>
  </div>

  {/* Latest Mood */}
  <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-6 rounded-2xl shadow-lg text-center">
    <h3 className="text-lg font-semibold">Latest Mood</h3>
    <p className="text-xl font-bold mt-2">
      {history.length > 0 ? history[0].mood : "None"}
    </p>
  </div>

</div>
{/* 🧠 Smart Summary */}
<div className="bg-black/80 text-white dark:bg-white/10 dark:text-white p-6 rounded-2xl shadow-lg text-center">
  <h3 className="text-xl font-semibold mb-2">Mood Insight</h3>

  <p className="text-lg">
    {avg >= 8 && "You're having an amazing emotional phase "}
    {avg >= 6 && avg < 8 && "Your mood is stable and positive "}
    {avg >= 4 && avg < 6 && "Some ups and downs detected "}
    {avg < 4 && history.length > 0 && "Take care of yourself. Better days ahead "}
    {history.length === 0 && "Start logging moods to see insights"}
  </p>

  {trend && (
    <p className="mt-2 text-sm opacity-80">
      Current Trend: {trend}
    </p>
  )}
</div>
</div>
         {/* 📅 History */}
{history.filter(h=>h.user===auth.currentUser?.email).length > 0 && (
  <div className="mt-10">
    <h2 className="text-2xl font-bold mb-4">Your Mood History</h2>

    {/* delete selected */}
    {selectedItems.length > 0 && (
      <button
        onClick={handleMultiDelete}
        className="mb-4 bg-red-600 px-4 py-2 rounded-lg"
      >
        Delete Selected
      </button>
    )}

    {history
      .filter(h => h.user === auth.currentUser?.email)
      .map((item) => (
        <div
          key={item.id}
          className="bg-white/90 dark:bg-white/10 backdrop-blur-lg text-black dark:text-white p-4 mb-3 rounded-xl shadow-lg flex justify-between items-center border border-white/10"
        >
          <div>
            <p>Date: {item.date}</p>
            <p>Mood: {item.mood}</p>
            <p>Scale: {item.scale}/10</p>
            <p>{item.note}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(item)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>

            <input
              type="checkbox"
              onChange={(e)=>{
                if(e.target.checked){
                  setSelectedItems([...selectedItems,item.id])
                }else{
                  setSelectedItems(selectedItems.filter(i=>i!==item.id))
                }
              }}
            />
          </div>
        </div>
      ))}
  </div>
)}

        {/* 📊 Bar Graph Section */}
{history.length > 0 && (
  <div className="w-full max-w-2xl mt-12 bg-white/80 dark:bg-slate-800 backdrop-blur-md rounded-3xl p-6 shadow-xl">
    <h2 className="text-xl font-bold mb-4 text-center">
      Emotional Analytics 
    </h2>

    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Bar dataKey="value" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>

    <p className="text-center mt-3 opacity-70 text-sm">
      Based on your overall emotional intensity average
    </p>
  </div>
)}

        {/* Footer */}
        <footer className="mt-10 text-sm opacity-70 text-center">
          Built by Alakh Raj Singh  
        </footer>

      </div>

    </div>
  );
}
export default Tracker;