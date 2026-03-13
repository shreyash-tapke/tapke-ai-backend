require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ollama = require("./ollama");
const authMiddleware = require("./auth");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Schema
const ChatSchema = new mongoose.Schema({
  user: String,
  question: String,
  response: String,
  timestamp: { type: Date, default: Date.now }
});
const Chat = mongoose.model("Chat", ChatSchema);

// Protected route
app.post("/ask", authMiddleware, async (req, res) => {
  const { question, user } = req.body;
  try {
    const answer = await ollama.askModel(question);
    await Chat.create({ user, question, response: answer });
    res.json({ response: answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Tapke AI backend running on port ${PORT}`));
