import express from "express";
import authController from "../controllers/authControllers.js"; // Adjust the path if necessary

const router = express.Router();

// Login route
router.post("/login", authController.login); // Connects to the login function

// Register route
router.post("/register", authController.signup); // Connects to the signup function

// Analyze conversation route
router.get("/analyzeConversation", authController.analyzeConversation); // Connects to the analyzeConversation function

export default router;
