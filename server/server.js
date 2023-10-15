const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const recipeData = require("../CookingMasters/data/recipes.json");

const app = express();

app.use(express.json()); // parse JSON requests
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const OPENAI_KEY = process.env.OPENAI_KEY;
const BASE_URL = "https://api.openai.com/v1";
const CHAT_URL = `${BASE_URL}/chat/completions`;
const IMAGE_GENERATION_URL = `${BASE_URL}/images/generations`;

app.post("/api/chat", async (req, res) => {
  const messages = req.body.messages;

  try {
    const response = await fetch(CHAT_URL, {
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

app.post("/api/image", async (req, res) => {
  console.log("Hitting the imnage endpoint!");

  try {
    const prompt = req.body.prompt;

    const response = await fetch(IMAGE_GENERATION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        size: "256x256",
      }),
    });

    const { data } = await response.json();

    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Image generator error: ", error);
    res
      .status(500)
      .json({ error: "Something went wrong while generating an image." });
  }
});

app.post("/api/recipe", async (req, res) => {
  try {
    const content = `
    1. Generate a delicious recipe to cook only using ingredients in ***?

    ***
    ${req.body.ingredients}
    ***

    2. Your recipe should be returned in this exact format ***

    2.5 Each step MUST include a 'timer' property, in minutes. 

    ***
    ${JSON.stringify(recipeData[0])}  
    ***

    3. Answer in JSON only. `;

    const messages = [
      { role: "system", content: "Imagine you are a masterchef" },
      { role: "user", content },
    ];

    const response = await fetch(CHAT_URL, {
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

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
