import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Save, Image, Mic, Tag, Sparkles, Moon, Sun, Cloud } from 'lucide-react';

// AnimatedNumber with spring animation
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrame;
    const startTime = Date.now();
    const startValue = displayValue;
    const duration = 500; // Animation duration in ms

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Cubic easing
      setDisplayValue(Math.floor(startValue + (value - startValue) * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <span>{displayValue}</span>;
};

// Mood Selection Component
const MoodSelector = ({ mood, setMood }) => {
  const moods = [
    { icon: <Sun className="w-6 h-6" />, label: 'Happy', color: 'text-yellow-400' },
    { icon: <Cloud className="w-6 h-6" />, label: 'Neutral', color: 'text-blue-400' },
    { icon: <Moon className="w-6 h-6" />, label: 'Reflective', color: 'text-purple-400' }
  ];

  return (
    <div className="flex space-x-4">
      {moods.map(({ icon, label, color }) => (
        <button
          key={label}
          onClick={() => setMood(label.toLowerCase())}
          className={`p-3 rounded-lg transition-all duration-300 ${
            mood === label.toLowerCase()
              ? `${color} bg-white/10 scale-110`
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex flex-col items-center space-y-1">
            {icon}
            <span className="text-xs">{label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

// Main Journal Component
const JournalApp = () => {
  // Existing state management
  const [activeSection, setActiveSection] = useState('write');
  const [journalText, setJournalText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [mood, setMood] = useState('neutral');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sample data remains the same as in your original code
  const moodData = [
    { date: 'Mon', positivity: 85 },
    { date: 'Tue', positivity: 72 },
    { date: 'Wed', positivity: 90 },
    { date: 'Thu', positivity: 65 },
    { date: 'Fri', positivity: 88 },
    { date: 'Sat', positivity: 95 },
    { date: 'Sun', positivity: 82 },
  ];

  const writingPrompts = [
    'What made you smile today?',
    'Describe a challenge you overcame',
    'What are you grateful for?',
    'What would you tell your younger self?',
    'Describe your perfect day',
  ];

  // Enhanced save handler with animation
  const handleSave = () => {
    if (!title.trim() || !journalText.trim()) {
      // Add shake animation to empty fields
      const element = !title.trim() ? '.title-input' : '.journal-textarea';
      document.querySelector(element).classList.add('animate-shake');
      setTimeout(() => {
        document.querySelector(element).classList.remove('animate-shake');
      }, 500);
      return;
    }

    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1000);
  };

  // Content rendering helper
  const renderWritingArea = () => (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-[#18212F] rounded-2xl border border-[#9D58F6]/20 p-6 backdrop-blur-lg 
        shadow-lg transition-all duration-300 hover:border-[#9D58F6]/40 group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title of your entry..."
          className="title-input w-full bg-transparent text-2xl font-semibold mb-4 focus:outline-none 
            border-b border-[#9D58F6]/20 pb-2 transition-all duration-300 focus:border-[#9D58F6]/60
            group-hover:border-[#9D58F6]/40"
        />
        
        <MoodSelector mood={mood} setMood={setMood} />
        
        <textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="Start writing your thoughts..."
          className="journal-textarea w-full h-96 bg-transparent resize-none focus:outline-none 
            text-lg leading-relaxed mt-4 transition-all duration-300"
        />
        
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className={`transition-all duration-300 ${
            isTyping ? 'text-[#9D58F6]' : 'text-[#9D58F6]/60'
          }`}>
            <AnimatedNumber value={wordCount} /> words
          </span>
          <span className="text-[#9D58F6]/60">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Image className="w-5 h-5" />, label: 'Add Image' },
          { icon: <Mic className="w-5 h-5" />, label: 'Voice Note' },
          { icon: <Tag className="w-5 h-5" />, label: 'Tag Entry' }
        ].map(({ icon, label }) => (
          <button
            key={label}
            className="bg-[#18212F] p-4 rounded-xl border border-[#9D58F6]/20 
              hover:border-[#9D58F6]/40 transition-all duration-300 group"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-[#9D58F6] group-hover:scale-110 transition-transform duration-300">
                {icon}
              </span>
              <span className="text-white/80 group-hover:text-white">{label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Save button with enhanced animations
  const renderSaveButton = () => (
    <div className="fixed bottom-8 right-8 animate-slideUp">
      {saveSuccess && (
        <div className="absolute -top-12 right-0 bg-green-500 text-white px-4 py-2 
          rounded-lg animate-fadeInOut flex items-center space-x-2">
          <span>Saved successfully!</span>
          <Sparkles className="w-4 h-4" />
        </div>
      )}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`
          group
          flex items-center space-x-2
          bg-[#9D58F6] text-white 
          px-8 py-4 rounded-xl
          transition-all duration-300
          shadow-lg hover:shadow-xl
          hover:bg-[#9D58F6]/90
          ${isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'}
        `}
      >
        <span className="relative inline-flex items-center">
          {isSaving ? (
            <Save className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5 transition-transform group-hover:rotate-12" />
          )}
          <span className="ml-2">Save Entry</span>
          <Sparkles 
            className={`
              ml-2 w-5 h-5
              transition-all duration-300
              ${isSaving ? 'opacity-0' : 'animate-pulse'}
            `}
          />
        </span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#18212F] text-white relative overflow-hidden">
      {/* Your existing ThreeBackground component would go here */}

      <div className="fixed inset-0 bg-[#18212F]/50 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 backdrop-blur-lg border-b border-[#9D58F6]/10">
          {/* Your existing header content */}
        </header>

        {/* Main Area */}
        <main className="max-w-7xl mx-auto p-6">
          {activeSection === "write" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slideUp">
              {renderWritingArea()}
              {/* Your existing sidebar content */}
            </div>
          )}

          {activeSection === "entries" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
              {sampleEntries.map((entry, index) => (
                <div
                  key={index}
                  className="bg-[#18212F] rounded-2xl border border-[#9D58F6]/20 p-6 backdrop-blur-lg 
                    hover:border-[#9D58F6]/40 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold group-hover:text-[#9D58F6] transition-colors duration-300">
                      {entry.title}
                    </h3>
                    <span className="text-sm text-[#9D58F6]/60">
                      {entry.date}
                    </span>
                  </div>
                  <p className="text-white/60 mb-4 line-clamp-3">
                    {entry.preview}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {entry.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 rounded-full bg-[#9D58F6]/10 text-[#9D58F6] text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-white/40">
                      {entry.wordCount} words
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {activeSection === "write" && renderSaveButton()}

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-fadeInOut {
          animation: fadeInOut 2s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default JournalApp;