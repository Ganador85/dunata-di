import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
const port = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

// ČIA SVARBIAUSIA – įjungiam static failus
app.use(express.static(path.join(__dirname, "public")));

app.post("/ask", async (req, res) => {
  const message = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Tu esi draugiškas AI pagalbininkas." },
        { role: "user", content: message }
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI klaida:", error.message);
    res.status(500).json({ reply: "Klaida iš OpenAI." });
  }
});

app.listen(port, () => {
  console.log(`Serveris veikia: http://localhost:${port}`);
});
