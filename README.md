# 🤖 My-Ai | Secure Backend Proxy for Adi Chatbot

A production-ready Node.js proxy server designed to bridge the gap between a frontend client and the **Groq API** securely.

## 🛡️ Why This Exists?

- **Secret Protection**: Keeps your `GROQ_API_KEY` hidden from the browser/client-side.
- **CORS Management**: Handles cross-origin requests from `adixdd.in` without security blocks.
- **Error Handling**: Provides a resilient translation layer for AI message streams.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Middleware**: Manual CORS Headers + JSON Parsing
- **API Integration**: Groq Llama 3 API via `node-fetch`

## 📡 Live Endpoint

The production server is live at: `https://my-ai-1ss5.onrender.com`

## 🛠️ Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/adityaprajapati-0/My-Ai.git
   ```
2. Install: `npm install`
3. Add `.env`:
   ```text
   GROQ_API_KEY=your_key_here
   ```
4. Run: `node server.js`

---

Built by **adixdd** 🕶️
