import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Heart, Smile, Target, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const BertSentimentAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sentimentData, setSentimentData] = useState({
    weeklyData: [],
    sentiment: 0,
    anxiety: 0,
    depression: 0,
    stress: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/analyzeConversation",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setSentimentData(data);
      } catch (err) {
        console.error("Error fetching sentiment data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-12 h-12 text-purple-500" />
          </motion.div>
          <p className="text-gray-500 dark:text-gray-400">
            Analyzing conversation sentiment...
          </p>
        </div>
      </div>
    );
  }

  const getMoodLabel = (sentiment) => {
    if (sentiment >= 80) return "Very Positive";
    if (sentiment >= 60) return "Positive";
    if (sentiment >= 40) return "Neutral";
    if (sentiment >= 20) return "Negative";
    return "Very Negative";
  };

  const getStressLevel = (stress) => {
    if (stress <= 30) return "Low";
    if (stress <= 60) return "Moderate";
    return "High";
  };

  const getEmotionalState = (anxiety, depression) => {
    const average = (anxiety + depression) / 2;
    if (average <= 30) return "Stable";
    if (average <= 60) return "Mixed";
    return "Concerning";
  };

  const calculateTrend = (weeklyData) => {
    if (!weeklyData || weeklyData.length < 2) return "0";
    const firstDay = weeklyData[0].sentiment;
    const lastDay = weeklyData[weeklyData.length - 1].sentiment;
    const trend = (((lastDay - firstDay) / firstDay) * 100).toFixed(1);
    return trend > 0 ? `+${trend}` : trend;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">
          Aura Chat Sentiment Analysis Report
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          AI-powered sentiment analysis using BERT transformers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                {getMoodLabel(sentimentData.sentiment)}
              </p>
            </div>
            <Heart className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-300">
                Stress Level
              </p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-200">
                {getStressLevel(sentimentData.stress)}
              </p>
            </div>
            <Target className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Emotional State
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">
                {getEmotionalState(
                  sentimentData.anxiety,
                  sentimentData.depression
                )}
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      <div className="h-80 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={sentimentData.weeklyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="date" tick={false} />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              name="Sentiment"
              dataKey="sentiment"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              name="Anxiety"
              dataKey="anxiety"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              name="Depression"
              dataKey="depression"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              name="Stress"
              dataKey="stress"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: "#f59e0b", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default BertSentimentAnalysis;
