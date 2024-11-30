import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/authRoute.js";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { promises as fs } from "fs";
import natural from "natural";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Initialize sentiment analyzer
const analyzer = new natural.SentimentAnalyzer(
  "English",
  natural.PorterStemmer,
  "afinn"
);
const tokenizer = new natural.WordTokenizer();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Received request at: ${req.originalUrl}`);
  next();
});

// Helper function for sentiment analysis
const analyzeSentiment = (text) => {
  const tokens = tokenizer.tokenize(text);

  // Get base sentiment score (-5 to 5 range)
  const sentimentScore = analyzer.getSentiment(tokens);

  // Convert to 0-100 range
  const normalizedSentiment = ((sentimentScore + 5) / 10) * 100;

  // Extract emotional indicators
  const anxietyWords = [
    "worry",
    "anxious",
    "nervous",
    "stress",
    "fear",
    "scared",
  ];
  const depressionWords = [
    "sad",
    "depressed",
    "down",
    "hopeless",
    "miserable",
    "lonely",
  ];
  const stressWords = [
    "overwhelmed",
    "pressure",
    "burden",
    "tension",
    "strain",
    "exhausted",
  ];

  const tokensLower = tokens.map((token) => token.toLowerCase());

  // Calculate emotional metrics based on word presence
  const anxietyScore = calculateEmotionalScore(tokensLower, anxietyWords);
  const depressionScore = calculateEmotionalScore(tokensLower, depressionWords);
  const stressScore = calculateEmotionalScore(tokensLower, stressWords);

  return {
    sentiment: Math.min(Math.max(normalizedSentiment, 0), 100),
    anxiety: anxietyScore,
    depression: depressionScore,
    stress: stressScore,
  };
};

// Helper function to calculate emotional scores
const calculateEmotionalScore = (tokens, emotionalWords) => {
  const matches = tokens.filter((token) =>
    emotionalWords.includes(token)
  ).length;
  const score = (matches / tokens.length) * 100;
  return Math.min(Math.max(score * 5, 0), 100); // Amplify score but keep in 0-100 range
};

// Get the last N days from the current date
const getLastNDays = (n) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toLocaleString("en-US", { weekday: "short" }));
  }
  return days;
};

// Sentiment analysis endpoint
app.get("/api/analyzeConversation", async (req, res) => {
  try {
    // Read conversation log file with absolute path
    const conversationText = await fs.readFile(
      "D:\\abhay\\Documents\\projects\\mental-health-disable-plateform\\Aura-mental-disable-Healthcare\\MentalHealthChatBot\\server\\conversation_log.txt",
      "utf8"
    );
    

    // Split the text into chunks (last 5 days for weekly data)
    const lines = conversationText.split("\n").filter((line) => line.trim());
    const lastFiveDays = getLastNDays(5);

    // Create daily chunks from the lines
    const chunks = lines.slice(-5).map((line, index) => ({
      text: line,
      date: lastFiveDays[index] || lastFiveDays[lastFiveDays.length - 1],
    }));

    // Analyze each chunk
    const weeklyData = chunks.map((chunk) => {
      const analysis = analyzeSentiment(chunk.text);
      return {
        date: chunk.date,
        sentiment: analysis.sentiment,
        anxiety: analysis.anxiety,
        depression: analysis.depression,
        stress: analysis.stress,
      };
    });

    // Calculate current day's metrics (using last chunk)
    const currentMetrics = weeklyData[weeklyData.length - 1] || {
      sentiment: 50,
      anxiety: 0,
      depression: 0,
      stress: 0,
    };

    const response = {
      sentiment: currentMetrics.sentiment,
      anxiety: currentMetrics.anxiety,
      depression: currentMetrics.depression,
      stress: currentMetrics.stress,
      weeklyData,
    };

    res.json(response);
  } catch (error) {
    console.error("Error in sentiment analysis:", error);
    res.status(500).json({ error: "Failed to analyze conversation" });
  }
});

// Routes
app.use("/api/auth", authRouter);

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/authentication", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection to database successfully done"))
  .catch((error) => console.error("Failed to connect to MongoDB", error));

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
