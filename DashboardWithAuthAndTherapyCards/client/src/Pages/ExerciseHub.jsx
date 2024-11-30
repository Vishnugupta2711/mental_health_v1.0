import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Activity,
  Heart,
  Clock,
  MessageSquare,
  Vibrate,
  Mic,
  RotateCw,
  CheckCircle,
  XCircle,
} from "lucide-react";

const AccessExerciseHub = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isVibrating, setIsVibrating] = useState(false);
  const [volume, setVolume] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    preferVibration: true,
    preferAudio: true,
    preferVisual: true,
    exerciseDifficulty: "medium",
  });

  // Voice recognition setup
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const command =
          event.results[event.results.length - 1][0].transcript.toLowerCase();
        handleVoiceCommand(command);
      };

      setRecognition(recognition);
    }
  }, []);

  const handleVoiceCommand = useCallback((command) => {
    if (command.includes("start")) {
      setIsPlaying(true);
    } else if (command.includes("pause") || command.includes("stop")) {
      setIsPlaying(false);
    } else if (command.includes("next")) {
      handleNextStep();
    } else if (command.includes("previous")) {
      handlePreviousStep();
    }
  }, []);

  const toggleVoiceControl = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
    setIsListening(!isListening);
  };

  const handleNextStep = () => {
    if (currentExercise && currentStep < currentExercise.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      announceStep(currentExercise.steps[currentStep + 1]);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      announceStep(currentExercise.steps[currentStep - 1]);
    }
  };

  const announceStep = (step) => {
    if (volume) {
      const speech = new SpeechSynthesisUtterance(step);
      window.speechSynthesis.speak(speech);
    }
  };

  // Enhanced exercise data with animations and difficulty levels
  const exercises = [
    {
      id: 1,
      name: "Mindful Shoulder Release",
      category: ["visual", "hearing"],
      duration: 300,
      description:
        "A gentle progression of shoulder movements with breathing coordination",
      difficulty: "beginner",
      steps: [
        "Sit tall with your feet flat on the ground",
        "Inhale as you slowly raise your shoulders to your ears",
        "Hold the position and take a deep breath",
        "Exhale as you gradually lower your shoulders",
        "Feel the tension release with each movement",
      ],
      animations: {
        prepare: { scale: 1.1, transition: { duration: 0.5 } },
        exercise: {
          y: [0, -20, 0],
          transition: { repeat: Infinity, duration: 4 },
        },
        complete: { scale: 1.2, opacity: 0 },
      },
      visualGuide: true,
      audioGuide: true,
      vibrationPattern: [1000, 500, 1000],
      intensity: "Low",
      benefits: [
        "Reduces shoulder tension",
        "Improves posture",
        "Promotes mindfulness",
      ],
    },
    // Add more exercises here...
  ];

  const CustomBox = ({ children, className = "", animate = {} }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      animate={animate}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 ${className}`}
    >
      {children}
    </motion.div>
  );

  const ExerciseAnimation = ({ exercise, isPlaying }) => (
    <motion.div
      className="w-full h-64 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-6"
      animate={
        isPlaying ? exercise.animations.exercise : exercise.animations.prepare
      }
    >
      <motion.div
        className="w-32 h-32 bg-purple-500 rounded-full flex items-center justify-center"
        animate={isPlaying ? { scale: [1, 1.2, 1], rotate: 360 } : {}}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Activity className="w-16 h-16 text-white" />
      </motion.div>
    </motion.div>
  );

  const ProgressIndicator = ({ current, total }) => (
    <div className="flex space-x-2 mb-4">
      {Array.from({ length: total }).map((_, idx) => (
        <motion.div
          key={idx}
          className={`h-2 rounded-full flex-1 ${
            idx <= current ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-700"
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: idx * 0.1 }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <AnimatePresence>
        {/* Header with dynamic welcome message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Interactive Exercise Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
            {isListening ? (
              <span className="text-green-500">Voice Commands Active</span>
            ) : (
              "Say 'Start' to begin your exercise journey"
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleVoiceControl}
              className={`p-2 rounded-full ${
                isListening
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Mic className="h-5 w-5" />
            </motion.button>
          </p>
        </motion.div>

        {/* Main Exercise Display */}
        {currentExercise && (
          <CustomBox className="mb-8">
            <ExerciseAnimation
              exercise={currentExercise}
              isPlaying={isPlaying}
            />

            <ProgressIndicator
              current={currentStep}
              total={currentExercise.steps.length}
            />

            <div className="flex justify-between items-center mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                className={`p-3 rounded-full ${
                  currentStep === 0
                    ? "bg-gray-100 text-gray-400"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                Previous
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 rounded-full bg-purple-500 text-white"
              >
                {isPlaying ? (
                  <PauseCircle className="h-8 w-8" />
                ) : (
                  <PlayCircle className="h-8 w-8" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextStep}
                disabled={currentStep === currentExercise.steps.length - 1}
                className={`p-3 rounded-full ${
                  currentStep === currentExercise.steps.length - 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                Next
              </motion.button>
            </div>

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-xl text-center mb-6"
            >
              {currentExercise.steps[currentStep]}
            </motion.div>

            {/* Exercise Controls */}
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setVolume(!volume)}
                className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30"
              >
                {volume ? (
                  <Volume2 className="h-6 w-6 text-purple-600" />
                ) : (
                  <VolumeX className="h-6 w-6 text-purple-600" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setUserPreferences((prev) => ({
                    ...prev,
                    preferVisual: !prev.preferVisual,
                  }))
                }
                className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30"
              >
                {userPreferences.preferVisual ? (
                  <Eye className="h-6 w-6 text-purple-600" />
                ) : (
                  <EyeOff className="h-6 w-6 text-purple-600" />
                )}
              </motion.button>
            </div>
          </CustomBox>
        )}

        {/* Exercise List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer"
              onClick={() => {
                setCurrentExercise(exercise);
                setCurrentStep(0);
                setIsPlaying(true);
              }}
            >
              <CustomBox>
                <div className="relative">
                  <h3 className="text-xl font-semibold mb-2">
                    {exercise.name}
                  </h3>
                  <span className="absolute top-0 right-0 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full text-sm">
                    {exercise.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {exercise.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{Math.floor(exercise.duration / 60)}m</span>
                  </div>
                  <div className="flex space-x-2">
                    {exercise.visualGuide && <Eye className="h-4 w-4" />}
                    {exercise.audioGuide && <Volume2 className="h-4 w-4" />}
                    {exercise.vibrationPattern && (
                      <Vibrate className="h-4 w-4" />
                    )}
                  </div>
                  
                </div>
              </CustomBox>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default AccessExerciseHub;
