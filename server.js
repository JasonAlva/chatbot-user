require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const port = 3000;

// Retrieve API key from environment variables
const API_KEY = process.env.API_KEY;

// Enable CORS for all origins (or restrict to specific origins if needed)
app.use(cors());

// Middleware to handle JSON requests
app.use(express.json());

// Route to handle chat requests
app.post("/generate", async (req, res) => {
  const userMessage = req.body.message;

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(userMessage, { maxTokens: 100 });
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Error generating content:", error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
});

// Serve static files
app.use(express.static("public"));

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
