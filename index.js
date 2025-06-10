
const express = require("express");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  const messages = req.body.messages || [];
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: messages,
    });
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI klaida:", error);
    res.status(500).json({ error: "Nepavyko gauti atsakymo" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveris veikia: http://localhost:${PORT}`);
});
