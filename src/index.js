import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// Enable CORS for all origins
app.use("*", cors());

// Health Check
app.get("/api/health", (c) => {
  return c.json({ status: "ok", time: new Date().toISOString() });
});

// Chat Endpoint
app.post("/api/chat", async (c) => {
  const { messages } = await c.req.json();

  if (!messages || !Array.isArray(messages)) {
    return c.json({ error: "Messages array is required" }, 400);
  }

  // Cloudflare Workers use 'env' object for environment variables
  const GROQ_API_KEY = c.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    console.error(
      "SERVER ERROR: GROQ_API_KEY is missing from environment variables!",
    );
    return c.json(
      { error: "Server configuration error (API Key missing)" },
      500,
    );
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY.trim()}`,
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
      return c.json(
        { error: "Groq API returned an error", details: errorData },
        response.status,
      );
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return c.json(
      { error: "Failed to communicate with Groq API", message: error.message },
      500,
    );
  }
});

// Root Endpoint
app.get("/", (c) => {
  return c.text("Adi AI Backend is running on Cloudflare Workers! 🚀");
});

export default app;
