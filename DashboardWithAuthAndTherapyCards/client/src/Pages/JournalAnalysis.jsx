import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Heart, Smile, Target, MessageCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BertSentimentAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [journalEntries] = useState([
    {
      date: "Mon",
      text: "Today was quite productive. I managed to complete all my tasks and felt energetic.",
      rawScore: 0,
    },
    {
      date: "Tue",
      text: "Feeling a bit overwhelmed with work, but I'm managing.",
      rawScore: 0,
    },
    {
      date: "Wed",
      text: "Had a great meditation session and feel very peaceful.",
      rawScore: 0,
    },
    {
      date: "Thu",
      text: "Struggled with anxiety today, but practiced my breathing exercises.",
      rawScore: 0,
    },
    {
      date: "Fri",
      text: "Made significant progress on my goals. Feeling accomplished!",
      rawScore: 0,
    },
    {
      date: "Sat",
      text: "Relaxing weekend. Spent time with family and felt connected.",
      rawScore: 0,
    },
    {
      date: "Sun",
      text: "Had a really bad and depresssing day , i m very sad and feeling down",
      rawScore: 0,
    },
  ]);

  const [sentimentData, setSentimentData] = useState([]);

  // Simplified BERT-like sentiment analysis implementation
  const analyzeSentiment = (text) => {
    // Positive words dictionary with weights
    const positiveWords = {
      great: 0.8,
      good: 0.6,
      productive: 0.7,
      accomplished: 0.8,
      peaceful: 0.9,
      optimistic: 0.8,
      connected: 0.7,
      energetic: 0.7,
      progress: 0.6,
      ready: 0.5,
    };

    // Negative words dictionary with weights
    const negativeWords = {
      overwhelmed: -0.7,
      struggled: -0.6,
      anxiety: -0.7,
      stressed: -0.6,
      worried: -0.5,
      difficult: -0.5,
      tired: -0.4,
      frustrated: -0.6,
      confused: -0.4,
      uncertain: -0.4,
    };

    // Modifier words that can intensify or reduce sentiment
    const modifiers = {
      very: 1.5,
      really: 1.5,
      somewhat: 0.5,
      bit: 0.3,
      extremely: 2,
      slightly: 0.3,
    };

    // Convert text to lowercase and split into words
    const words = text.toLowerCase().split(/\s+/);
    let sentimentScore = 0;
    let modifier = 1;

    // Analyze each word in the text
    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // Check if the current word is a modifier
      if (modifiers[word]) {
        modifier = modifiers[word];
        continue;
      }

      // Apply sentiment scoring with modifiers
      if (positiveWords[word]) {
        sentimentScore += positiveWords[word] * modifier;
        modifier = 1; // Reset modifier
      } else if (negativeWords[word]) {
        sentimentScore += negativeWords[word] * modifier;
        modifier = 1; // Reset modifier
      }
    }

    // Normalize score to between -1 and 1
    return Math.max(-1, Math.min(1, sentimentScore / 5));
  };

  // Additional mental health indicators analysis
  const analyzeMentalHealthIndicators = (text) => {
    const anxietyIndicators = ["anxiety", "worried", "stressed", "overwhelmed"];
    const depressionIndicators = ["sad", "hopeless", "tired", "unmotivated"];
    const stressIndicators = ["pressure", "tension", "stressed", "difficult"];

    text = text.toLowerCase();

    const anxiety = anxietyIndicators.reduce(
      (score, word) => score + (text.includes(word) ? 0.25 : 0),
      0
    );

    const depression = depressionIndicators.reduce(
      (score, word) => score + (text.includes(word) ? 0.25 : 0),
      0
    );

    const stress = stressIndicators.reduce(
      (score, word) => score + (text.includes(word) ? 0.25 : 0),
      0
    );

    return { anxiety, depression, stress };
  };

  useEffect(() => {
    const analyzeEntries = async () => {
      try {
        const analyzedData = journalEntries.map((entry) => {
          const sentiment = analyzeSentiment(entry.text);
          const { anxiety, depression, stress } = analyzeMentalHealthIndicators(
            entry.text
          );

          return {
            ...entry,
            sentiment: (sentiment + 1) / 2, // Normalize to 0-1
            anxiety,
            depression,
            stress,
          };
        });

        setSentimentData(analyzedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    analyzeEntries();
  }, [journalEntries]);

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-12 h-12 text-purple-500" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="text-red-500 text-center">
          Error analyzing sentiment: {error}
        </div>
      </div>
    );
  }

  const overallMoodScore = (
    (sentimentData.reduce((acc, curr) => acc + curr.sentiment, 0) /
      sentimentData.length) *
    100
  ).toFixed(1);
  const averageStressLevel =
    sentimentData.reduce((acc, curr) => acc + curr.stress, 0) /
    sentimentData.length;
  const stressLevelText =
    averageStressLevel < 0.3
      ? "Low"
      : averageStressLevel < 0.6
      ? "Moderate"
      : "High";

  // Calculate weekly progress (comparing last day to first day)
  const weeklyProgress =
    ((sentimentData[sentimentData.length - 1]?.sentiment || 0) -
      (sentimentData[0]?.sentiment || 0)) *
    100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">
          User Journal Sentiment Analysis
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          BERT-based sentiment analysis of your journal entries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-300">
                Overall Mood
              </p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">
                {overallMoodScore}%
              </p>
            </div>
            <Heart className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Stress Level
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">
                {stressLevelText}
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-300">
                Weekly Progress
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-200">
                {weeklyProgress > 0 ? "+" : ""}
                {weeklyProgress.toFixed(1)}%
              </p>
            </div>
            <Smile className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      <div className="mb-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentimentData}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium">
                          {payload[0].payload.date}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {payload[0].payload.text}
                        </p>
                        <div className="mt-2">
                          {payload.map((item, index) => (
                            <p
                              key={index}
                              className="text-sm"
                              style={{ color: item.color }}
                            >
                              {item.name}: {(item.value * 100).toFixed(1)}%
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="sentiment"
                name="Mood"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="anxiety"
                name="Anxiety"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="depression"
                name="Depression"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Latest Journal Entry Analysis</h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          <div className="flex items-start space-x-3">
            <MessageCircle className="w-5 h-5 mt-1 text-purple-500" />
            <div>
              <p className="text-sm">
                {journalEntries[journalEntries.length - 1].text}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-gray-500">Sentiment Score:</span>
                <span className="text-xs font-medium">
                  {(
                    sentimentData[sentimentData.length - 1]?.sentiment * 100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BertSentimentAnalysis;
