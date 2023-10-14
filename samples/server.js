const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json()); // parse JSON requests
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const OPENAI_KEY = process.env.OPENAI_KEY;
const URL = "https://api.openai.com/v1/chat/completions";

app.post("/api/chat", async (req, res) => {
  const messages = req.body.messages;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        temperature: 0,
        messages,
      }),
    });

    const data = await response.json();
    const message = data.choices[0].message;

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/general", async (req, res) => {});

app.post("/api/image", async (req, res) => {});

app.post("/api/recipe", async (req, res) => {});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
