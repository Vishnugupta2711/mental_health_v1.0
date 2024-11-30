import User from "../models/userModel.js"; // Adjust the path as necessary
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "../utils/appError.js";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = console; // Can be replaced with a proper logger
// Register User
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log("Signup request received:", { name, email });

    const userExists = await User.findOne({ email });
    console.log("Checking if user exists:", userExists);

    if (userExists) {
      return next(new createError("User already exists!", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log("New user created:", newUser);

    const token = jwt.sign({ _id: newUser._id }, "secretkey123", {
      expiresIn: "90d",
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    next(error);
  }
};

// Login User
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received:", { email });

    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return next(new createError("User not found!", 404));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      return next(new createError("Invalid Email or Password", 401));
    }

    const token = jwt.sign({ _id: user._id }, "secretkey123", {
      expiresIn: "90d",
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    next(error);
  }
};

const analyzeConversation = async (req, res) => {
  try {
    // Using relative path from the server root
    // Assuming this file is in server/controllers/
    const conversationLogPath = "../conversation_log.txt";

    // Resolve the path relative to the current file's location
    const absolutePath = resolve(__dirname, conversationLogPath);

    logger.info(`Attempting to read conversation log from: ${absolutePath}`);

    // Check if file exists using async/await
    try {
      await fs.access(absolutePath);
    } catch (error) {
      logger.error(`File not found at path: ${absolutePath}`);
      return res.status(404).json({
        error: "File not found",
        details: "The conversation log file could not be located",
        path: absolutePath,
      });
    }

    // Read and analyze the file
    const data = await fs.readFile(absolutePath, "utf8");

    if (!data || data.trim().length === 0) {
      logger.warn("File is empty or contains no valid data");
      return res.status(400).json({
        error: "Empty file",
        details: "The conversation log file is empty",
      });
    }

    logger.info("File data successfully retrieved");

    try {
      const analysis = await analyzeText(data); // Assuming analyzeText is async
      logger.info("Sentiment analysis completed successfully");

      return res.json({
        success: true,
        analysis,
        metadata: {
          fileSize: Buffer.from(data).length,
          analyzedAt: new Date().toISOString(),
        },
      });
    } catch (analysisError) {
      logger.error("Error during text analysis:", analysisError);
      return res.status(500).json({
        error: "Analysis failed",
        details: "Failed to analyze the conversation text",
        message: analysisError.message,
      });
    }
  } catch (error) {
    logger.error("Unexpected error:", error);
    return res.status(500).json({
      error: "Server error",
      details: "An unexpected error occurred while processing the request",
      message: error.message,
    });
  }
};

// Helper function to validate file path
const isValidFilePath = (filePath) => {
  try {
    parse(filePath);
    return true;
  } catch {
    return false;
  }
};

export default { signup, login, analyzeConversation };
