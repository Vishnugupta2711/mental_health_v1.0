import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Palette, Music, GamepadIcon, X, Waves, Cloud, Sun, 
  BookOpen, Heart, Brain, Smile, Frown, Meh,
  Volume2, VolumeX, ChevronRight, MessageCircle
} from "lucide-react";


// Enhanced Background Animation
const AnimatedBackground = ({ mood }) => {
  const getMoodColors = () => {
    switch(mood) {
      case 'happy': return 'from-yellow-200 via-orange-200 to-red-200';
      case 'calm': return 'from-blue-200 via-green-200 to-teal-200';
      case 'sad': return 'from-blue-300 via-purple-200 to-indigo-200';
      default: return 'from-blue-200 via-green-200 to-pink-200';
    }
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${getMoodColors()} transition-colors duration-1000`}>
        <div className="absolute inset-0">
          <div className="animate-clouds">
            <Cloud className="absolute top-10 left-[10%] w-24 h-24 text-white/30 animate-float-slow" />
            <Cloud className="absolute top-32 right-[15%] w-32 h-32 text-white/20 animate-float-slow" />
            <Cloud className="absolute bottom-20 left-[5%] w-28 h-28 text-white/30 animate-float-slow" />
          </div>
          <Sun className="absolute top-5 right-[30%] w-24 h-24 text-yellow-300/40 animate-pulse-slow" />
        </div>
        <Waves className="absolute bottom-10 left-[20%] w-48 h-48 text-blue-300/30 animate-wave" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
    </div>
  );
};

// Mood Music Player Component



const MoodMusicPlayer = ({ mood, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [audio, setAudio] = useState(null);

  const getMoodMusic = () => {
    switch(mood) {
      case 'happy': return "https://example.com/upbeat-jazz.mp3"; // Replace with actual URLs
      case 'calm': return "https://example.com/nature-sounds.mp3";
      case 'sad': return "https://example.com/soft-piano.mp3";
      default: return "https://example.com/ambient-music.mp3";
    }
  };

  useEffect(() => {
    const moodMusic = getMoodMusic();
    const newAudio = new Audio(moodMusic);
    newAudio.loop = true; // Makes the music loop for a continuous experience
    setAudio(newAudio);

    return () => {
      newAudio.pause();
      newAudio.currentTime = 0; // Reset audio when component unmounts
      setAudio(null);
    };
  }, [mood]);

  useEffect(() => {
    if (audio) {
      isPlaying ? audio.play() : audio.pause();
    }
  }, [isPlaying, audio]);

  return (
    <div className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg z-40">
      <div className="flex items-center gap-6">
        {isPlaying ? (
          <Volume2 
            className="w-8 h-8 cursor-pointer animate-pulse" 
            onClick={() => setIsPlaying(false)}
          />
        ) : (
          <VolumeX 
            className="w-8 h-8 cursor-pointer" 
            onClick={() => setIsPlaying(true)}
          />
        )}
        <div>
          <p className="text-lg font-semibold">{mood.charAt(0).toUpperCase() + mood.slice(1)} Music</p>
          <p className="text-base opacity-90">Music for {mood} mood</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-blue-600/50 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};





// Blog Preview Component
const BlogPreview = () => {
  const blogs = [
    {
      title: "Understanding Anxiety",
      excerpt: "Learn about common triggers and coping mechanisms...",
      author: "Dr. Smith",
      readTime: "5 min"
    },
    {
      title: "Mindfulness in Daily Life",
      excerpt: "Simple techniques to stay present and aware...",
      author: "Sarah Johnson",
      readTime: "3 min"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
      {blogs.map((blog, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
          <p className="text-gray-600 mb-4">{blog.excerpt}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{blog.author}</span>
            <span>{blog.readTime} read</span>
          </div>
          <button className="mt-4 flex items-center text-blue-500 hover:text-blue-600">
            Read more <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Main Component
const TherapyCards = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [currentMood, setCurrentMood] = useState("calm");
  const [showMoodSelector, setShowMoodSelector] = useState(false);
   const navigate = useNavigate();
    const handleGameTherapyClick = () => {
      navigate("/games"); // Navigate directly to the /games route
    };

  const moodIcons = {
    happy: <Smile className="w-8 h-8" />,
    calm: <Brain className="w-8 h-8" />,
    sad: <Frown className="w-8 h-8" />,
  };

  const cards = [
    {
      title: "Art Therapy",
      icon: <Palette className="w-8 h-8" />,
      description:
        "Express emotions through creative visual art to enhance mental clarity.",
      onClick: () => setShowCanvas(true),
      bgClass: "bg-gradient-to-br from-purple-400 to-purple-600",
      hoverEffect: "hover:shadow-purple-300",
    },
    {
      title: "Music Therapy",
      icon: <Music className="w-8 h-8" />,
      description:
        "Experience mood-based music therapy to improve emotional well-being.",
      onClick: () => {
        setShowMoodSelector(true);
        setShowMusic(true);
      },
      bgClass: "bg-gradient-to-br from-blue-400 to-blue-600",
      hoverEffect: "hover:shadow-blue-300",
    },
    {
      title: "Game Therapy",
      icon: <GamepadIcon className="w-8 h-8" />,
      description:
        "Engage in mindfulness games to reduce stress and improve focus.",
      onClick: handleGameTherapyClick,
      bgClass: "bg-gradient-to-br from-green-400 to-green-600",
      hoverEffect: "hover:shadow-green-300",
    },
    {
      title: "Community Blog",
      icon: <BookOpen className="w-8 h-8" />,
      description: "Read and share experiences with our supportive community.",
      onClick: () => {},
      bgClass: "bg-gradient-to-br from-pink-400 to-pink-600",
      hoverEffect: "hover:shadow-pink-300",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground mood={currentMood} />

      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-green-600">
            Mindful Therapy Space
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to your sanctuary of healing. Choose an activity that
            resonates with your current state of mind.
          </p>

          {/* Mood Selector */}
          <div className="flex justify-center gap-6 mt-8">
            {Object.entries(moodIcons).map(([mood, icon]) => (
              <button
                key={mood}
                onClick={() => setCurrentMood(mood)}
                className={`p-4 rounded-full transition-all duration-300 ${
                  currentMood === mood
                    ? "bg-white shadow-lg scale-110"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className={`transform transition-all duration-500 hover:scale-105 cursor-pointer
                bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg
                ${card.hoverEffect} hover:shadow-xl overflow-hidden`}
              style={{
                animation: `fadeIn 0.5s ease-out forwards`,
                animationDelay: `${index * 200}ms`,
              }}
              onClick={card.onClick}
            >
              <div className={`p-8 h-full ${card.bgClass} text-white`}>
                <div className="flex flex-col items-center text-center gap-6 mb-6">
                  <div className="transform transition-all duration-300 hover:rotate-12 hover:scale-110 p-4 bg-white/20 rounded-full">
                    {card.icon}
                  </div>
                  <h2 className="text-2xl font-bold">{card.title}</h2>
                </div>
                <p className="text-lg opacity-90 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <BlogPreview />

        {/* Journal Entry Section */}
        <div className="mt-16 max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-bold">Daily Reflection Journal</h2>
          </div>
          <textarea
            placeholder="How are you feeling today? Write your thoughts..."
            className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Save Entry
          </button>
        </div>
      </div>

      {/* Community Chat */}
      <div className="fixed bottom-8 left-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4 z-40">
        <div className="flex items-center gap-4 mb-4">
          <Heart className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold">Community Support</h3>
        </div>
        <div className="max-h-48 overflow-y-auto mb-4">
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm font-semibold">Sarah</p>
              <p className="text-sm text-gray-600">
                Feeling much better after today's art session!
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm font-semibold">Michael</p>
              <p className="text-sm text-gray-600">
                The breathing exercises really helped with anxiety.
              </p>
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Share your thoughts..."
          className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {showCanvas && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-[800px] relative shadow-2xl">
            <button
              onClick={() => setShowCanvas(false)}
              className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              Express Your Emotions
            </h2>
            <div className="mb-6 flex items-center gap-4">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-16 h-16 rounded-2xl cursor-pointer hover:scale-105 transition-transform"
              />
              <span className="text-lg text-gray-600">
                Choose a color that matches your mood
              </span>
            </div>
            <CanvasPainting color={selectedColor} />
            <div className="mt-6 flex justify-between items-center">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Save Artwork
              </button>
              <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Clear Canvas
              </button>
            </div>
          </div>
        </div>
      )}

      {showMusic && (
        <MoodMusicPlayer
          mood={currentMood}
          onClose={() => setShowMusic(false)}
        />
      )}
      {showGame && <MiniGames onClose={() => setShowGame(false)} />}
    </div>
  );
};

// Canvas Painting Component with enhanced features
const CanvasPainting = ({ color }) => {
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [brushSize, setBrushSize] = useState(5);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = brushSize;
  }, [color, brushSize]);

  const saveDrawingState = () => {
    const canvas = canvasRef.current;
    const newHistory = drawingHistory.slice(0, currentStep + 1);
    newHistory.push(canvas.toDataURL());
    setDrawingHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const undo = () => {
    if (currentStep > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = drawingHistory[currentStep - 1];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setCurrentStep(currentStep - 1);
      };
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastPosition({ x, y });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-32"
        />
        <span className="text-sm text-gray-600">Brush Size: {brushSize}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={750}
        height={500}
        className="border-2 border-gray-200 rounded-2xl cursor-crosshair shadow-inner bg-white transition-shadow duration-300 hover:shadow-lg"
        onMouseDown={(e) => {
          const rect = canvasRef.current.getBoundingClientRect();
          setLastPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          setIsDrawing(true);
        }}
        onMouseUp={() => {
          setIsDrawing(false);
          saveDrawingState();
        }}
        onMouseOut={() => setIsDrawing(false)}
        onMouseMove={draw}
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={undo}
          disabled={currentStep <= 0}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Undo
        </button>
      </div>
    </div>
  );
};

export default TherapyCards;