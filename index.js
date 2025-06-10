const express = require("express");
const path = require("path");
const { OpenAIApi, Configuration } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 10000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json());
app.use(express.static("public"));

app.post("/ask", async (req, res) => {
  const message = req.body.message;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Tu esi draugiškas AI pagalbininkas." },
        { role: "user", content: message }
      ]
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI klaida:", error.message);
    res.status(500).json({ reply: "Klaida jungiantis prie OpenAI API." });
  }
});

app.listen(port, () => {
  console.log(`Serveris veikia: http://localhost:${port}`);
});
