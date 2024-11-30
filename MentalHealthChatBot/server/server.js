const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs").promises;
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Helper function to log chat messages
async function logChat(userMessage, botResponse) {
  const timestamp = new Date().toISOString();
  const logEntry = `
[${timestamp}]
User: ${userMessage}
Bot: ${botResponse}
----------------------------------------
`;

  try {
    const logFilePath = path.join(__dirname, "conversation_log.txt");
    await fs.appendFile(logFilePath, logEntry, "utf8");
  } catch (error) {
    console.error("Error writing to log file:", error);
    // Continue execution even if logging fails
  }
}

// Helper function to get chat response
async function getChatResponse(userMessage, chatHistory) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `You are a supportive and empathetic mental health chatbot. Your role is to:
  1. Have natural conversations with users about their mental health concerns
  2. Ask relevant follow-up questions to better understand their situation
  3. Look for potential signs of common mental health issues like anxiety, depression, stress, etc.
  4. Provide a brief, non-clinical assessment of whether they might benefit from professional help
  5. Always remind users that you are not a substitute for professional medical advice
  6. Be supportive and encouraging while maintaining appropriate boundaries
  7. Provide helpful coping strategies and self-care tips when appropriate

  Important rules:
  - Never diagnose conditions
  - Always encourage seeking professional help if concerns are serious
  - Maintain a warm, empathetic tone
  - Ask clarifying questions when needed
  - Be direct but gentle when discussing sensitive topics
  
  Previous conversation context: ${JSON.stringify(chatHistory)}
  
  User's message: ${userMessage}
  
  Provide a thoughtful, empathetic response while following the above guidelines.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

app.post("/chat", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    const response = await getChatResponse(message, chatHistory);

    // Log the conversation
    await logChat(message, response);

    res.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({
      error: "An error occurred while processing your message",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
