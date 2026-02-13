const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error(
      "SERVER ERROR: GROQ_API_KEY is missing from environment variables!",
    );
    return res
      .status(500)
      .json({ error: "Server configuration error (API Key missing)" });
  }

  try {
    console.log(`Sending request to Groq with ${messages.length} messages...`);
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Error Status:", response.status, errorData);
      return res.status(response.status).json({
        error: "Groq API returned an error",
        details: errorData,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Fetch Error:", error.message);
    res
      .status(500)
      .json({
        error: "Failed to communicate with Groq API",
        message: error.message,
      });
  }
});

app.get("/", (req, res) => {
  res.send("Adi AI Backend is running! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
