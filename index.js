const express = require('express');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let messages = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;
  messages.push({ role: 'user', content: userMessage });

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: messages,
    });

    const botMessage = response.data.choices[0].message.content;
    messages.push({ role: 'assistant', content: botMessage });

    res.json({ reply: botMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Klaida iš OpenAI API.' });
  }
});

app.listen(port, () => {
  console.log(`Serveris veikia: http://localhost:${port}`);
});
