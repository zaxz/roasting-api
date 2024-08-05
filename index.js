// server.js
require('dotenv').config()
const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const cors = require("cors");

const app = express();
const port = 3000;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.use(cors());

app.post('/roasting', async (req, res) => {
  try {
    const { nama } = req.query;
    const { desc } = req.query;
    const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ];
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" , safetySettings});
    const chatSession = model.startChat();

    const result = await chatSession.sendMessage(`berikan roasting singkat yang menyindir, kejam, menyakitkan hati dan lucu dalam bahasa gaul untuk sesorang bernama ${nama} dan berdasarkan deskripsi tersebut : ${desc}`);
    res.send(result.response.text());
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});