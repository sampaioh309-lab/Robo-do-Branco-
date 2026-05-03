const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("API ONLINE 🚀");
});

app.get("/blaze", async (req, res) => {
    try {
        const response = await fetch("https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/history/1?page=1&limit=1");
        const data = await response.json();
        res.json(data);
    } catch (e) {
        res.json({ error: "erro" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando"));
