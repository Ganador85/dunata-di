const express = require('express');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// OpenAI inicializavimas
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let messages = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Grąžina HTML puslapį
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Apdoroja užklausą
app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;
  messages.push({ role: 'user', content: userMessage });

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
    });

    const botMessage = chatCompletion.choices[0].message.content;
    messages.push({ role: 'assistant', content: botMessage });

    res.json({ reply: botMessage });
  } catch (error) {
    console.error('OpenAI API klaida:', error.message);
    res.status(500).json({ reply: 'Klaida kreipiantis į OpenAI.' });
  }
});

// Paleidžia serverį
app.listen(port, () => {
  console.log(`Serveris veikia: http://localhost:${port}`);
});
