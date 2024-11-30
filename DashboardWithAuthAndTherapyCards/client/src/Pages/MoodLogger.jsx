import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MoodLogger = () => {
  const [selectedMood, setSelectedMood] = useState(3);
  const [note, setNote] = useState("");
  const [view, setView] = useState("daily");

  const moodData = [
    { date: "Mon", mood: 4, note: "Had a great therapy session" },
    { date: "Tue", mood: 3, note: "Regular day" },
    { date: "Wed", mood: 5, note: "Achieved my daily goals!" },
    { date: "Thu", mood: 2, note: "Feeling tired" },
    { date: "Fri", mood: 4, note: "Family visit" },
    { date: "Sat", mood: 4, note: "Relaxing weekend" },
    { date: "Sun", mood: 3, note: "Preparing for next week" },
  ];

  const moodEmojis = ["😢", "😕", "😐", "🙂", "😊"];

  return (
    <div className="min-h-screen w-full bg-[#18212F] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Glassmorphism Header */}
        <div className="relative mb-12">
          <div className="absolute -top-8 -left-8 w-48 h-48 bg-[#9D58F6] rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-12 right-12 w-32 h-32 bg-[#9D58F6] rounded-full opacity-10 blur-2xl"></div>
          <h1 className="text-5xl font-bold text-white mb-3 relative">
            Mood Space
          </h1>
          <p className="text-[#9D58F6]/80 text-xl relative">
            Track your emotional journey
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column - Mood Input */}
          <div className="space-y-12">
            {/* Mood Selection */}
            <div className="bg-[#18212F]/80 p-10 rounded-3xl border border-[#9D58F6]/20 backdrop-blur-lg relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-60 h-60 bg-[#9D58F6] rounded-full opacity-5 blur-3xl"></div>

              <h2 className="text-3xl font-semibold text-white mb-8">
                How are you feeling?
              </h2>
              <div className="flex justify-between items-center px-4">
                {moodEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMood(index + 1)}
                    className={`relative group transform transition-all duration-300 ${
                      selectedMood === index + 1
                        ? "scale-125"
                        : "hover:scale-110"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-[#9D58F6] rounded-full opacity-0 
                      group-hover:opacity-20 transition-opacity duration-300 blur-xl ${
                        selectedMood === index + 1 ? "opacity-30" : ""
                      }`}
                    ></div>
                    <div className="text-5xl p-6 relative z-10">{emoji}</div>
                    {selectedMood === index + 1 && (
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#9D58F6] rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div className="relative bg-[#18212F]/80 p-10 rounded-3xl border border-[#9D58F6]/20 backdrop-blur-lg shadow-xl">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#9D58F6] rounded-full opacity-5 blur-3xl"></div>
              <h2 className="text-3xl font-semibold text-white mb-6">
                Add a Note
              </h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="How was your day?"
                className="w-full h-40 bg-[#18212F] border border-[#9D58F6]/30 rounded-2xl p-6 text-white text-lg
                  placeholder:text-[#9D58F6]/40 focus:outline-none focus:border-[#9D58F6]/60 
                  transition-all duration-300 resize-none relative z-10"
              />
              <button
                className="mt-6 w-full bg-[#9D58F6] text-white py-4 px-8 rounded-2xl text-lg
                hover:bg-[#9D58F6]/90 transition-all duration-300 relative overflow-hidden group shadow-lg"
              >
                <span className="relative z-10">Save Entry</span>
                <div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 
                  transition-opacity duration-300"
                ></div>
              </button>
            </div>
          </div>

          {/* Right Column - Visualization */}
          <div className="bg-[#18212F]/80 p-10 rounded-3xl border border-[#9D58F6]/20 backdrop-blur-lg relative shadow-xl">
            <div className="absolute top-0 left-0 w-60 h-60 bg-[#9D58F6] rounded-full opacity-5 blur-3xl"></div>

            {/* View Toggle */}
            <div className="flex space-x-4 mb-8">
              {["daily", "weekly", "monthly"].map((viewOption) => (
                <button
                  key={viewOption}
                  onClick={() => setView(viewOption)}
                  className={`px-6 py-3 rounded-xl text-lg transition-all duration-300 ${
                    view === viewOption
                      ? "bg-[#9D58F6]/20 text-[#9D58F6] shadow-lg"
                      : "text-white/60 hover:text-white hover:bg-[#9D58F6]/10"
                  }`}
                >
                  {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
                </button>
              ))}
            </div>

            {/* Graph */}
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <XAxis
                    dataKey="date"
                    stroke="#9D58F6"
                    strokeWidth={0.5}
                    tick={{ fill: "#9D58F6", opacity: 0.6 }}
                  />
                  <YAxis
                    domain={[1, 5]}
                    stroke="#9D58F6"
                    strokeWidth={0.5}
                    tick={{ fill: "#9D58F6", opacity: 0.6 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18212F",
                      border: "1px solid rgba(157, 88, 246, 0.2)",
                      borderRadius: "16px",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    }}
                    itemStyle={{ color: "#9D58F6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#9D58F6"
                    strokeWidth={4}
                    dot={{
                      fill: "#18212F",
                      stroke: "#9D58F6",
                      strokeWidth: 3,
                      r: 6,
                    }}
                    activeDot={{
                      fill: "#9D58F6",
                      stroke: "#18212F",
                      strokeWidth: 3,
                      r: 8,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              {[
                { label: "Average Mood", value: "3.8" },
                { label: "Entries", value: "23" },
                { label: "Streak", value: "7 days" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-[#18212F] p-6 rounded-2xl border border-[#9D58F6]/20 shadow-lg"
                >
                  <p className="text-[#9D58F6]/60 text-base mb-2">
                    {stat.label}
                  </p>
                  <p className="text-white text-2xl font-semibold">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: "Download Report", icon: "📊" },
            { label: "Set Reminder", icon: "⏰" },
            { label: "Share Progress", icon: "📤" },
            { label: "View Insights", icon: "🔍" },
          ].map((action, index) => (
            <button
              key={index}
              className="bg-[#18212F]/80 border border-[#9D58F6]/20 rounded-2xl p-6
                hover:bg-[#9D58F6]/10 transition-all duration-300 group shadow-lg"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </span>
                <span className="text-lg text-white/80 group-hover:text-white transition-colors duration-300">
                  {action.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodLogger;
