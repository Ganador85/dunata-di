import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.post("/klausk", async (req, res) => {
  const klausimas = req.body.klausimas;

  if (!klausimas) {
    return res.status(400).json({ klaida: "Trūksta klausimo" });
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: klausimas }],
      model: "gpt-3.5-turbo",
    });

    const atsakymas = completion.choices[0].message.content;
    res.json({ atsakymas });
  } catch (klaida) {
    console.error(klaida);
    res.status(500).json({ klaida: "Įvyko klaida apdorojant užklausą" });
  }
});

app.get("/", (req, res) => {
  res.send("AI pagalbininkas veikia!");
});

app.listen(port, () => {
  console.log(`Serveris veikia: http://localhost:${port}`);
});
