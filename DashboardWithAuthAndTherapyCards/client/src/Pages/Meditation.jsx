import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Settings, BarChart, Moon, Sun, Wind, Clock, Heart, Brain, RefreshCw, ChevronRight, Music2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, ResponsiveContainer } from 'recharts';

const MEDITATION_TYPES = {
  BREATHING: {
    name: 'Breathing',
    icon: Wind,
    patterns: [
      { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, holdEmpty: 4 },
      { name: '4-7-8 Technique', inhale: 4, hold: 7, exhale: 8, holdEmpty: 0 },
      { name: 'Deep Calm', inhale: 5, hold: 2, exhale: 6, holdEmpty: 0 },
    ]
  },
  GUIDED: {
    name: 'Guided',
    icon: Brain,
    sessions: [
      { name: 'Body Scan', duration: 600 },
      { name: 'Loving Kindness', duration: 900 },
      { name: 'Mindful Awareness', duration: 1200 }
    ]
  },
  UNGUIDED: {
    name: 'Unguided',
    icon: Moon,
    durations: [300, 600, 900, 1200, 1800, 3600]
  }
};

const AMBIENT_SOUNDS = [
  { name: 'Rain', frequency: 220 },
  { name: 'Ocean', frequency: 180 },
  { name: 'Forest', frequency: 200 },
  { name: 'White Noise', frequency: 240 },
  { name: 'Om', frequency: 432 },
  { name: 'Bells', frequency: 528 }
];

const AccessibleMeditation = () => {
  // Core states
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [phaseSeconds, setPhaseSeconds] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // Enhanced meditation states
  const [meditationType, setMeditationType] = useState('BREATHING');
  const [selectedPattern, setSelectedPattern] = useState(MEDITATION_TYPES.BREATHING.patterns[0]);
  const [selectedDuration, setSelectedDuration] = useState(600);
  const [activeSounds, setActiveSounds] = useState([]);
  const [breathCount, setBreathCount] = useState(0);
  const [heartRate, setHeartRate] = useState(75);
  const [calmScore, setCalmScore] = useState(80);
  
  // Analytics states
  const [sessionData, setSessionData] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [weeklyStats, setWeeklyStats] = useState([]);
  
  // Animation states
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [ambientVolume, setAmbientVolume] = useState(50);

  // Audio Context
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef({});

  const PRIMARY_COLOR = '#9D58F6';
  const BACKGROUND_COLOR = '#18212F';

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Handle ambient sound
  const toggleSound = useCallback((sound) => {
    if (!audioContextRef.current) return;

    if (oscillatorsRef.current[sound.name]) {
      oscillatorsRef.current[sound.name].stop();
      delete oscillatorsRef.current[sound.name];
      setActiveSounds(prev => prev.filter(s => s !== sound.name));
    } else {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.frequency.setValueAtTime(sound.frequency, audioContextRef.current.currentTime);
      gainNode.gain.setValueAtTime(ambientVolume / 100, audioContextRef.current.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      oscillator.start();
      
      oscillatorsRef.current[sound.name] = oscillator;
      setActiveSounds(prev => [...prev, sound.name]);
    }
  }, [ambientVolume]);

  // Session data tracking
  const updateSessionData = useCallback(() => {
    const newDataPoint = {
      timestamp: new Date().getTime(),
      breathRate: breathCount / (seconds / 60),
      heartRate,
      calmScore,
      breathCount,
    };

    setSessionData(prev => {
      const newData = [...prev, newDataPoint];
      return newData.slice(-30);
    });
  }, [breathCount, seconds, heartRate, calmScore]);

  // Core meditation timer
  useEffect(() => {
    let timer;
    let animationTimer;
    
    if (isPlaying) {
      timer = setInterval(() => {
        setSeconds(prev => {
          if (prev >= selectedDuration) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
        
        // Update breath phases based on selected pattern
        setPhaseSeconds(prev => {
          const newPhaseSeconds = prev + 1;
          let totalPhaseTime;
          
          switch (breathPhase) {
            case 'inhale':
              totalPhaseTime = selectedPattern.inhale;
              break;
            case 'hold':
              totalPhaseTime = selectedPattern.hold;
              break;
            case 'exhale':
              totalPhaseTime = selectedPattern.exhale;
              break;
            case 'holdEmpty':
              totalPhaseTime = selectedPattern.holdEmpty;
              break;
            default:
              totalPhaseTime = 4;
          }
          
          if (newPhaseSeconds >= totalPhaseTime) {
            setBreathPhase(prev => {
              switch (prev) {
                case 'inhale':
                  return 'hold';
                case 'hold':
                  return 'exhale';
                case 'exhale':
                  return selectedPattern.holdEmpty > 0 ? 'holdEmpty' : 'inhale';
                case 'holdEmpty':
                  setBreathCount(c => c + 1);
                  return 'inhale';
                default:
                  return 'inhale';
              }
            });
            return 0;
          }
          return newPhaseSeconds;
        });

        // Simulate biometrics
        setHeartRate(prev => {
          const variance = Math.random() * 2 - 1;
          return Math.max(60, Math.min(90, prev + variance));
        });

        setCalmScore(prev => {
          const variance = Math.random() * 2 - 1;
          return Math.max(0, Math.min(100, prev + variance));
        });

        // Update analytics
        if (seconds % 2 === 0) {
          updateSessionData();
        }
      }, 1000);

      // Smooth animations
      animationTimer = setInterval(() => {
        setRotation(prev => (prev + 0.5) % 360);
        setScale(prev => 1 + Math.sin(Date.now() / 1000) * 0.05);
      }, 50);
    }

    return () => {
      clearInterval(timer);
      clearInterval(animationTimer);
    };
  }, [isPlaying, seconds, breathPhase, selectedPattern, selectedDuration, updateSessionData]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const formatPhaseMessage = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe In...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe Out...';
      case 'holdEmpty':
        return 'Hold Empty...';
      default:
        return 'Breathe...';
    }
  };

  const getGradientStyle = (progress) => ({
    background: `linear-gradient(45deg, ${PRIMARY_COLOR}, #B388FF)`,
    opacity: progress / 100,
  });

  return (
    <div className="space-y-8">
      {/* Meditation Type Selection */}
      <div className="flex justify-center gap-4 mb-8">
        {Object.entries(MEDITATION_TYPES).map(([key, type]) => {
          const Icon = type.icon;
          return (
            <button
              key={key}
              onClick={() => setMeditationType(key)}
              className={`p-4 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                meditationType === key ? 'bg-[#9D58F6]/20 scale-105' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <Icon className="h-6 w-6 text-white mb-2" />
              <span className="text-white text-sm">{type.name}</span>
            </button>
          );
        })}
      </div>

      {/* Breathing Circle */}
      <div
        className="relative mx-auto w-96 h-96 flex items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {/* Animated rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${PRIMARY_COLOR} ${calmScore}%, transparent ${calmScore}%)`,
              transform: `rotate(${rotation + i * 120}deg)`,
              opacity: 0.1 + i * 0.1,
              scale: 1 - i * 0.1,
            }}
          />
        ))}

        {/* Central breathing guide */}
        <div
          className="text-center p-12 rounded-full bg-white/5 backdrop-blur-sm text-white transition-all duration-1000 relative"
          style={{
            transform: `scale(${breathPhase === 'inhale' ? 1.1 : breathPhase === 'exhale' ? 0.9 : 1})`,
            fontSize: `${fontSize}px`
          }}
        >
          <div className="text-2xl font-light mb-2">{formatPhaseMessage()}</div>
          <div className="text-4xl font-bold">{phaseSeconds + 1}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause meditation' : 'Start meditation'}
          className="h-20 w-20 rounded-full bg-gradient-to-r from-[#9D58F6] to-[#B388FF] hover:opacity-90 text-white flex items-center justify-center transition-transform duration-300 hover:scale-105"
          style={{ boxShadow: `0 0 30px ${PRIMARY_COLOR}40` }}
        >
          {isPlaying ? (
            <Pause className="h-10 w-10" />
          ) : (
            <Play className="h-10 w-10" />
          )}
        </button>
      </div>

      {/* Progress and Stats */}
      <div className="grid grid-cols-3 gap-4 text-white">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
          <Heart className="h-5 w-5 mx-auto mb-2 text-pink-400" />
          <div className="text-2xl font-bold">{Math.round(heartRate)}</div>
          <div className="text-xs opacity-70">BPM</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
          <Brain className="h-5 w-5 mx-auto mb-2 text-blue-400" />
          <div className="text-2xl font-bold">{Math.round(calmScore)}</div>
          <div className="text-xs opacity-70">Calm Score</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
          <Wind className="h-5 w-5 mx-auto mb-2 text-green-400" />
          <div className="text-2xl font-bold">{breathCount}</div>
          <div className="text-xs opacity-70">Breaths</div>
        </div>
      </div>

      {/* Timer Progress */}
      <div className="space-y-3">
        <div className="text-center text-3xl text-white font-light">
          {formatTime(seconds)} / {formatTime(selectedDuration)}
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(seconds / selectedDuration) * 100}%`,
              background: `linear-gradient(90deg, ${PRIMARY_COLOR}, #B388FF)`
            }}
          />
        </div>
      </div>
      
      {/* Session Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
          <Clock className="h-5 w-5 mx-auto mb-2 text-blue-400" />
          <div className="text-xl font-bold text-white">{totalSessions}</div>
          <div className="text-xs text-white/70">Total Sessions</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
          <RefreshCw className="h-5 w-5 mx-auto mb-2 text-green-400" />
          <div className="text-xl font-bold text-white">{currentStreak}</div>
          <div className="text-xs text-white/70">Day Streak</div>
          </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
          <ChevronRight className="h-5 w-5 mx-auto mb-2 text-yellow-400" />
          <div className="text-xl font-bold text-white">{totalMinutes}</div>
          <div className="text-xs text-white/70">Total Minutes</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
          <Heart className="h-5 w-5 mx-auto mb-2 text-red-400" />
          <div className="text-xl font-bold text-white">{Math.round(calmScore)}</div>
          <div className="text-xs text-white/70">Avg Calm Score</div>
        </div>
      </div>

      {/* Pattern Selection */}
      {meditationType === 'BREATHING' && (
        <div className="mt-8">
          <h3 className="text-white text-lg font-medium mb-4">Breathing Pattern</h3>
          <div className="grid grid-cols-3 gap-4">
            {MEDITATION_TYPES.BREATHING.patterns.map((pattern) => (
              <button
                key={pattern.name}
                onClick={() => setSelectedPattern(pattern)}
                className={`p-4 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                  selectedPattern.name === pattern.name 
                    ? 'bg-[#9D58F6]/20 scale-105' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <Wind className="h-5 w-5 text-white mb-2 mx-auto" />
                <div className="text-white text-sm font-medium">{pattern.name}</div>
                <div className="text-white/70 text-xs mt-1">
                  {pattern.inhale}-{pattern.hold}-{pattern.exhale}
                  {pattern.holdEmpty ? `-${pattern.holdEmpty}` : ''}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Duration Selection */}
      {meditationType === 'UNGUIDED' && (
        <div className="mt-8">
          <h3 className="text-white text-lg font-medium mb-4">Duration (minutes)</h3>
          <div className="grid grid-cols-3 gap-4">
            {MEDITATION_TYPES.UNGUIDED.durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`p-4 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                  selectedDuration === duration 
                    ? 'bg-[#9D58F6]/20 scale-105' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <Clock className="h-5 w-5 text-white mb-2 mx-auto" />
                <div className="text-white text-sm">{duration / 60} min</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Guided Session Selection */}
      {meditationType === 'GUIDED' && (
        <div className="mt-8">
          <h3 className="text-white text-lg font-medium mb-4">Guided Sessions</h3>
          <div className="grid grid-cols-2 gap-4">
            {MEDITATION_TYPES.GUIDED.sessions.map((session) => (
              <button
                key={session.name}
                onClick={() => setSelectedDuration(session.duration)}
                className={`p-4 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                  selectedDuration === session.duration 
                    ? 'bg-[#9D58F6]/20 scale-105' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <Brain className="h-5 w-5 text-white mb-2 mx-auto" />
                <div className="text-white text-sm font-medium">{session.name}</div>
                <div className="text-white/70 text-xs mt-1">
                  {session.duration / 60} minutes
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ambient Sound Controls */}
      <div className="mt-8">
        <h3 className="text-white text-lg font-medium mb-4">Ambient Sounds</h3>
        <div className="grid grid-cols-3 gap-4">
          {AMBIENT_SOUNDS.map((sound) => (
            <button
              key={sound.name}
              onClick={() => toggleSound(sound)}
              className={`p-4 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                activeSounds.includes(sound.name) 
                  ? 'bg-[#9D58F6]/20 scale-105' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <Music2 className="h-5 w-5 text-white mb-2 mx-auto" />
              <div className="text-white text-sm">{sound.name}</div>
              <div className="text-white/70 text-xs mt-1">{sound.frequency}Hz</div>
            </button>
          ))}
        </div>
        <div className="mt-4">
          <label className="text-white text-sm mb-2 block">Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={ambientVolume}
            onChange={(e) => setAmbientVolume(Number(e.target.value))}
            className="w-full accent-[#9D58F6]"
          />
        </div>
      </div>
    </div>
  );
};

export default AccessibleMeditation;
